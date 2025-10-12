import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 API Settings Reset - Iniciando...');
    
    // Obter o token de autorização do header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorização não encontrado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const supabase = createClient();
    
    // Configurar o token de autenticação para RLS
    await supabase.auth.setSession({
      access_token: token,
      refresh_token: ''
    });
    
    // Verificar o token com Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
    
    // Buscar perfil do utilizador
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();
    
    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'Perfil do utilizador não encontrado' }, { status: 404 });
    }
    
    // Configurações padrão
    const defaultSettings = {
      modo_escuro: false,
      tema_cor: 'azul',
      tamanho_fonte: 'medio',
      compacto: false,
      animacoes: true,
      notificacoes_email: true,
      notificacoes_push: true,
      notificacoes_sms: false,
      som_notificacoes: true,
      vibracao: true,
      idioma: 'pt',
      fuso_horario: 'Europe/Lisbon',
      privacidade_perfil: 'publico',
      marketing_emails: false
    };
    
    // Verificar se já existem configurações
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userProfile.id)
      .single();
    
    let result;
    if (existingSettings) {
      // Atualizar para configurações padrão
      const { data, error } = await supabase
        .from('user_settings')
        .update(defaultSettings)
        .eq('user_id', userProfile.id)
        .select()
        .single();
      
      if (error) {
        console.error('🔴 Erro ao resetar configurações:', error);
        return NextResponse.json(
          { error: 'Erro ao resetar configurações', details: error.message },
          { status: 500 }
        );
      }
      
      result = data;
    } else {
      // Criar com configurações padrão
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: userProfile.id,
          ...defaultSettings
        })
        .select()
        .single();
      
      if (error) {
        console.error('🔴 Erro ao criar configurações padrão:', error);
        return NextResponse.json(
          { error: 'Erro ao criar configurações padrão', details: error.message },
          { status: 500 }
        );
      }
      
      result = data;
    }
    
    // Remover campos internos da resposta
    const { id, user_id, created_at, updated_at, ...userSettings } = result;
    
    console.log('🔵 API Settings Reset - Configurações resetadas:', userSettings);
    
    return NextResponse.json({
      success: true,
      message: 'Configurações resetadas para os valores padrão',
      settings: userSettings
    });
    
  } catch (error) {
    console.error('Erro ao resetar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
