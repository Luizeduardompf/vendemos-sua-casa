import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { extractIdFromSlug } from '@/lib/slug';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    
    // Aguardar params e extrair ID do parâmetro (pode ser ID direto ou slug)
    const resolvedParams = await params;
    let imovelId = resolvedParams.id;
    const extractedId = extractIdFromSlug(resolvedParams.id);
    if (extractedId) {
      imovelId = extractedId;
    }

    // Verificar se o ID é um UUID antigo (formato antigo)
    const isOldUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(imovelId);
    if (isOldUuid) {
      return NextResponse.json(
        { 
          error: 'Este imóvel não está mais disponível. O sistema foi atualizado e este link é antigo.', 
          authorized: false, 
          redirectTo: '/dashboard/proprietario/imoveis',
          isOldLink: true
        },
        { status: 410 } // Gone - recurso não está mais disponível
      );
    }

    // Verificar se o usuário está logado via header Authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { 
          error: 'Token não fornecido', 
          authorized: false, 
          redirectTo: '/auth/login' 
        },
        { status: 401 }
      );
    }

    // Verificar se o usuário está logado via token
    const { data: { user: authUser }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !authUser) {
      console.log('🔵 API Check Ownership - Token inválido:', userError?.message);
      return NextResponse.json(
        { 
          error: 'Token inválido', 
          authorized: false, 
          redirectTo: '/auth/login' 
        },
        { status: 401 }
      );
    }
    
    console.log('🔵 API Check Ownership - Token válido para usuário:', authUser.email);

    // Buscar dados do usuário
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .single();

    if (userDataError || !userData) {
      return NextResponse.json(
        { 
          error: 'Usuário não encontrado', 
          authorized: false, 
          redirectTo: '/auth/login' 
        },
        { status: 404 }
      );
    }

    // Determinar se é um ID novo (ABC-123) ou UUID antigo
    const isNewIdFormat = /^[A-Z]{3}-[0-9]{3}$/.test(imovelId);
    console.log('🔵 API Check Ownership - ID recebido:', imovelId);
    console.log('🔵 API Check Ownership - É formato novo?', isNewIdFormat);
    
    // Verificar se o usuário é proprietário do imóvel
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select('id, proprietario_id')
      .eq(isNewIdFormat ? 'imovel_id' : 'id', imovelId)
      .single();

    if (imovelError || !imovel) {
      return NextResponse.json(
        { 
          error: 'Imóvel não encontrado', 
          authorized: false, 
          redirectTo: '/dashboard/proprietario' 
        },
        { status: 404 }
      );
    }

    const isOwner = imovel.proprietario_id === userData.id;
    
    console.log('🔵 API Check Ownership - Usuário autenticado:', userData.email);
    console.log('🔵 API Check Ownership - Verificação de propriedade:', isOwner);

    if (!isOwner) {
        return NextResponse.json(
          { 
            error: 'Acesso negado - você não é o proprietário deste imóvel', 
            authorized: false, 
            redirectTo: `/imovel/${resolvedParams.id}/access-denied` 
          },
          { status: 403 }
        );
    }

    return NextResponse.json({
      authorized: true,
      user: {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        user_type: userData.user_type
      }
    });

  } catch (error) {
    console.error('Erro ao verificar propriedade do imóvel:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor', 
        authorized: false, 
        redirectTo: '/dashboard/proprietario' 
      },
      { status: 500 }
    );
  }
}
