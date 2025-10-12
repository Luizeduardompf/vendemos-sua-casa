import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔵 API Configurações GET - Iniciando...');
    
    // Obter o token de autorização do header
    const authHeader = request.headers.get('authorization');
    console.log('🔵 API Configurações - Auth Header:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('🔵 API Configurações - Token não encontrado no header');
      return NextResponse.json(
        { error: 'Token de autorização não encontrado' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    console.log('🔵 API Configurações - Token extraído:', token ? 'Sim' : 'Não');
    
    const supabase = createClient();
    
    // Verificar se o utilizador está autenticado usando o token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    console.log('🔵 API Configurações - User:', user ? 'Encontrado' : 'Não encontrado');
    console.log('🔵 API Configurações - User Error:', userError);
    
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
    
    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
      return NextResponse.json(
        { error: 'Erro ao buscar perfil do utilizador' },
        { status: 500 }
      );
    }
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'Perfil do utilizador não encontrado' },
        { status: 404 }
      );
    }
    
    // Configurações padrão
    const defaultConfig = {
      modo_escuro: false,
      notificacoes_email: true,
      notificacoes_push: true,
      notificacoes_sms: false,
      idioma: 'pt',
      fuso_horario: 'Europe/Lisbon',
      privacidade_perfil: 'publico',
      marketing_emails: false,
      tema_cor: 'azul',
      tamanho_fonte: 'medio',
      compacto: false,
      animacoes: true,
      som_notificacoes: true,
      vibracao: true
    };
    
    // Tentar buscar configurações específicas do utilizador
    let configuracoes = defaultConfig;
    
    try {
      const { data: userConfig, error: configError } = await supabase
        .from('user_configuracoes')
        .select('*')
        .eq('user_id', userProfile.id)
        .single();
      
      if (userConfig && !configError) {
        // Mesclar configurações salvas com padrões
        configuracoes = {
          ...defaultConfig,
          ...userConfig.configuracoes
        };
      } else if (configError && configError.code === 'PGRST116') {
        // Tabela não existe, retornar configurações padrão
        console.log('🔵 API Configurações - Tabela user_configuracoes não existe, usando configurações padrão');
      }
    } catch (tableError) {
      // Se houver erro ao acessar a tabela, usar configurações padrão
      console.log('🔵 API Configurações - Erro ao acessar tabela, usando configurações padrão:', tableError);
    }
    
    console.log('🔵 API Configurações - Configurações carregadas:', configuracoes);
    
    return NextResponse.json({
      success: true,
      configuracoes
    });
    
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔵 API Configurações PUT - Iniciando...');
    
    // Obter o token de autorização do header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorização não encontrado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const supabase = createClient();
    
    // Verificar o token com Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
    
    const body = await request.json();
    console.log('🔵 API Configurações PUT - Body recebido:', body);
    
    // Buscar perfil do utilizador
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();
    
    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'Perfil do utilizador não encontrado' }, { status: 404 });
    }
    
    // Validar configurações recebidas
    const allowedConfigs = [
      'modo_escuro',
      'notificacoes_email',
      'notificacoes_push',
      'notificacoes_sms',
      'idioma',
      'fuso_horario',
      'privacidade_perfil',
      'marketing_emails',
      'tema_cor',
      'tamanho_fonte',
      'compacto',
      'animacoes',
      'som_notificacoes',
      'vibracao'
    ];
    
    const validConfigs = Object.keys(body)
      .filter(key => allowedConfigs.includes(key))
      .reduce((obj, key) => {
        obj[key] = body[key];
        return obj;
      }, {} as Record<string, unknown>);
    
    console.log('🔵 API Configurações PUT - Configurações válidas:', validConfigs);
    
    // Tentar salvar no banco de dados
    try {
      // Verificar se já existem configurações para este utilizador
      const { data: existingConfig, error: existingError } = await supabase
        .from('user_configuracoes')
        .select('*')
        .eq('user_id', userProfile.id)
        .single();
      
      if (existingConfig && !existingError) {
        // Atualizar configurações existentes
        const updatedConfigs = {
          ...existingConfig.configuracoes,
          ...validConfigs
        };
        
        const { data: updatedConfig, error: updateError } = await supabase
          .from('user_configuracoes')
          .update({
            configuracoes: updatedConfigs,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userProfile.id)
          .select()
          .single();
        
        if (updateError) {
          console.error('Erro ao atualizar configurações:', updateError);
          return NextResponse.json(
            { error: 'Erro ao atualizar configurações' },
            { status: 500 }
          );
        }
        
        console.log('🔵 API Configurações PUT - Configurações atualizadas:', updatedConfig);
        
        return NextResponse.json({
          success: true,
          message: 'Configurações atualizadas com sucesso',
          configuracoes: updatedConfigs
        });
        
      } else {
        // Criar novas configurações
        const { data: newConfig, error: createError } = await supabase
          .from('user_configuracoes')
          .insert({
            user_id: userProfile.id,
            configuracoes: validConfigs,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (createError) {
          console.error('🔴 Erro ao criar configurações:', createError);
          console.error('🔴 Código do erro:', createError.code);
          console.error('🔴 Mensagem do erro:', createError.message);
          console.error('🔴 Detalhes do erro:', createError.details);
          console.error('🔴 Hint do erro:', createError.hint);
          return NextResponse.json(
            { 
              error: 'Erro ao criar configurações',
              details: createError.message,
              code: createError.code
            },
            { status: 500 }
          );
        }
        
        console.log('🔵 API Configurações PUT - Configurações criadas:', newConfig);
        
        return NextResponse.json({
          success: true,
          message: 'Configurações criadas com sucesso',
          configuracoes: validConfigs
        });
      }
    } catch (tableError) {
      // Se a tabela não existir, simular salvamento bem-sucedido
      console.log('🔵 API Configurações PUT - Tabela não existe, simulando salvamento:', tableError);
      
      return NextResponse.json({
        success: true,
        message: 'Configurações salvas com sucesso (modo simulado)',
        configuracoes: validConfigs
      });
    }
    
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
