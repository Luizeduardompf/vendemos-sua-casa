import { NextRequest, NextResponse } from 'next/server';
import { createClient, createClientWithCookies } from '@/lib/supabase';
import { generateImovelId } from '@/lib/imovel-id';
import { createImovelSlug } from '@/lib/slug';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando cadastro de imóvel...');
    
    // Verificar autenticação via Authorization header primeiro
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Authorization header:', authHeader ? 'Presente' : 'Ausente');
    
    let user = null;
    let authError = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('🔐 Token encontrado, verificando...');
      const supabase = createClient();
      const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token);
      
      if (!tokenError && tokenUser) {
        user = tokenUser;
        console.log('✅ Usuário autenticado via token:', user.email);
      } else {
        authError = tokenError;
        console.log('❌ Erro na autenticação via token:', tokenError?.message);
      }
    } else {
      console.log('🍪 Tentando autenticação via cookies...');
      // Fallback para cookies se não houver Authorization header
      const supabase = await createClientWithCookies();
      const { data: { user: cookieUser }, error: cookieError } = await supabase.auth.getUser();
      
      if (!cookieError && cookieUser) {
        user = cookieUser;
        console.log('✅ Usuário autenticado via cookies:', user.email);
      } else {
        authError = cookieError;
        console.log('❌ Erro na autenticação via cookies:', cookieError?.message);
      }
    }
    
    if (authError || !user) {
      console.log('❌ Falha na autenticação:', authError?.message);
      return NextResponse.json(
        { error: 'Usuário não autenticado', details: authError?.message },
        { status: 401 }
      );
    }

    // Usar o cliente apropriado para buscar dados do usuário
    const supabaseForDB = authHeader ? createClient() : await createClientWithCookies();
    
    // Buscar dados do usuário (primeiro por ID, depois por email)
    let { data: userData, error: userError } = await supabaseForDB
      .from('users')
      .select('id, user_type, email')
      .eq('id', user.id)
      .single();

    // Se não encontrar por ID, tentar por email
    if (userError || !userData) {
      const { data: userByEmail, error: emailError } = await supabaseForDB
        .from('users')
        .select('id, user_type, email')
        .eq('email', user.email)
        .single();
      
      if (emailError || !userByEmail) {
        // Se não encontrar por email, criar o usuário automaticamente
        console.log('👤 Usuário não encontrado, criando automaticamente...');
        
        const newUserData = {
          id: user.id,
          email: user.email,
          user_type: 'proprietario', // Assumir proprietário por padrão
          nome_completo: user.user_metadata?.full_name || user.email.split('@')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data: createdUser, error: createError } = await supabaseForDB
          .from('users')
          .insert(newUserData)
          .select('id, user_type, email')
          .single();
        
        if (createError || !createdUser) {
          return NextResponse.json(
            { 
              error: 'Erro ao criar usuário',
              details: createError?.message || 'Falha ao criar usuário na tabela users'
            },
            { status: 500 }
          );
        }
        
        userData = createdUser;
        console.log('✅ Usuário criado com sucesso:', userData);
      } else {
        userData = userByEmail;
      }
    }

    if (userData.user_type !== 'proprietario') {
      return NextResponse.json(
        { error: 'Apenas proprietários podem cadastrar imóveis' },
        { status: 403 }
      );
    }

    // Obter dados do formulário
    const formData = await request.json();
    
    console.log('📝 Dados recebidos:', JSON.stringify(formData, null, 2));

    // Gerar ID único e slug
    const imovelId = generateImovelId();
    const slug = createImovelSlug(formData.titulo, imovelId);

    // Mapear dados do formulário para o schema do banco (apenas campos essenciais)
    const imovelData = {
      proprietario_id: userData.id,
      imovel_id: imovelId,
      titulo: formData.titulo,
      descricao: formData.descricao || null,
      slug: slug,
      tipo_imovel: formData.tipo_imovel || 'apartamento',
      categoria: formData.categoria || 'venda',
      
      // Preços
      preco_venda: formData.categoria === 'venda' ? parseFloat(formData.preco) || null : null,
      preco_arrendamento: formData.categoria === 'arrendamento' ? parseFloat(formData.preco) || null : null,
      
      // Localização
      morada: formData.endereco || '',
      localidade: formData.cidade || 'Lisboa',
      distrito: formData.distrito || 'Lisboa',
      
      // Características físicas básicas
      area_total: parseFloat(formData.area_total) || null,
      area_util: parseFloat(formData.area_util) || null,
      quartos: parseInt(formData.quartos) || null,
      casas_banho: parseInt(formData.banheiros) || null,
      
      // Status padrão
      status: 'pendente',
      visibilidade: 'privado'
    };

    console.log('🏠 Dados do imóvel preparados:', imovelData);

    // Inserir imóvel no banco
    const { data: imovelInserido, error: imovelError } = await supabaseForDB
      .from('imoveis')
      .insert(imovelData)
      .select()
      .single();

    if (imovelError) {
      console.error('❌ Erro ao inserir imóvel:', imovelError);
      console.error('📊 Dados que causaram erro:', JSON.stringify(imovelData, null, 2));
      return NextResponse.json(
        { 
          error: 'Erro ao cadastrar imóvel', 
          details: imovelError.message,
          code: imovelError.code,
          hint: imovelError.hint
        },
        { status: 500 }
      );
    }

    console.log('✅ Imóvel cadastrado com sucesso:', imovelInserido);

    // Registrar a criação no histórico de status
    try {
      const { data: historyId, error: historyError } = await supabaseForDB
        .rpc('registrar_mudanca_status_imovel', {
          p_imovel_id: imovelInserido.id,
          p_status_anterior: null, // NULL para criação
          p_status_novo: 'pendente',
          p_user_id: userData.id,
          p_motivo: 'Criação do imóvel',
          p_observacoes: `Imóvel "${formData.titulo}" criado via cadastro`
        });
      
      if (historyError) {
        console.error('⚠️ Erro ao registrar criação no histórico:', historyError);
        // Não falhar a operação por causa do histórico
      } else {
        console.log('✅ Criação registrada no histórico:', historyId);
      }
    } catch (historyErr) {
      console.error('⚠️ Erro ao registrar no histórico:', historyErr);
      // Não falhar a operação por causa do histórico
    }

    return NextResponse.json({
      success: true,
      message: 'Imóvel cadastrado com sucesso!',
      imovel: imovelInserido
    });

  } catch (error) {
    console.error('❌ Erro no cadastro:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor', 
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
