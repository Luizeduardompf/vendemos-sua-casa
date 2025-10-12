import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔵 API Configurações Categoria - Iniciando...');
    
    // Obter o token de autorização do header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorização não encontrado' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    const supabase = createClient();
    
    // Verificar se o utilizador está autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }
    
    // Buscar perfil do utilizador
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();
    
    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'Perfil do utilizador não encontrado' },
        { status: 404 }
      );
    }
    
    // Obter categoria dos query parameters
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    
    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoria não especificada' },
        { status: 400 }
      );
    }
    
    // Definir configurações por categoria
    const configuracaoCategorias = {
      aparencia: {
        modo_escuro: false,
        tema_cor: 'azul',
        tamanho_fonte: 'medio',
        compacto: false,
        animacoes: true
      },
      notificacoes: {
        notificacoes_email: true,
        notificacoes_push: true,
        notificacoes_sms: false,
        som_notificacoes: true,
        vibracao: true
      },
      privacidade: {
        privacidade_perfil: 'publico',
        marketing_emails: false
      },
      sistema: {
        idioma: 'pt',
        fuso_horario: 'Europe/Lisbon'
      }
    };
    
    // Verificar se a categoria existe
    if (!(categoria in configuracaoCategorias)) {
      return NextResponse.json(
        { error: 'Categoria inválida' },
        { status: 400 }
      );
    }
    
    // Buscar configurações do utilizador
    const { data: userConfig, error: configError } = await supabase
      .from('user_configuracoes')
      .select('configuracoes')
      .eq('user_id', userProfile.id)
      .single();
    
    let configuracoes = configuracaoCategorias[categoria as keyof typeof configuracaoCategorias];
    
    if (userConfig && !configError) {
      // Filtrar apenas as configurações da categoria solicitada
      const categoriaConfigs = configuracaoCategorias[categoria as keyof typeof configuracaoCategorias];
      configuracoes = { ...categoriaConfigs };
      
      for (const key in categoriaConfigs) {
        if (key in userConfig.configuracoes) {
          (configuracoes as Record<string, unknown>)[key] = userConfig.configuracoes[key];
        }
      }
    }
    
    console.log(`🔵 API Configurações Categoria - Configurações da categoria ${categoria}:`, configuracoes);
    
    return NextResponse.json({
      success: true,
      categoria,
      configuracoes
    });
    
  } catch (error) {
    console.error('Erro ao buscar configurações por categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
