import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { z } from 'zod';

// Schema de validação para as configurações
const settingsSchema = z.object({
  // Aparência
  modo_escuro: z.boolean().optional(),
  tema_cor: z.enum(['azul', 'verde', 'roxo', 'laranja', 'vermelho']).optional(),
  tamanho_fonte: z.enum(['pequeno', 'medio', 'grande']).optional(),
  compacto: z.boolean().optional(),
  animacoes: z.boolean().optional(),
  
  // Notificações
  notificacoes_email: z.boolean().optional(),
  notificacoes_push: z.boolean().optional(),
  notificacoes_sms: z.boolean().optional(),
  som_notificacoes: z.boolean().optional(),
  vibracao: z.boolean().optional(),
  
  // Idioma e Localização
  idioma: z.enum(['pt', 'en', 'es', 'fr']).optional(),
  fuso_horario: z.string().optional(),
  
  // Privacidade
  privacidade_perfil: z.enum(['publico', 'privado', 'amigos']).optional(),
  marketing_emails: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    console.log('🔵 API Settings GET - Iniciando...');
    
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
    
    // Buscar configurações da tabela user_settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userProfile.id)
      .single();
    
    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('🔴 Erro ao buscar configurações:', settingsError);
      return NextResponse.json(
        { error: 'Erro ao buscar configurações' },
        { status: 500 }
      );
    }
    
    // Se não existir configurações, retornar valores padrão
    if (!settings) {
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
      
      console.log('🔵 API Settings GET - Usando configurações padrão');
      return NextResponse.json({
        success: true,
        settings: defaultSettings
      });
    }
    
    // Remover campos internos da resposta
    const { id, user_id, created_at, updated_at, ...userSettings } = settings;
    
    console.log('🔵 API Settings GET - Configurações carregadas:', userSettings);
    
    return NextResponse.json({
      success: true,
      settings: userSettings
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
    console.log('🔵 API Settings PUT - Iniciando...');
    
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
    
    const body = await request.json();
    console.log('🔵 API Settings PUT - Body recebido:', body);
    
    // Validar dados recebidos
    const validatedData = settingsSchema.parse(body);
    console.log('🔵 API Settings PUT - Dados validados:', validatedData);
    
    // Buscar perfil do utilizador
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();
    
    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'Perfil do utilizador não encontrado' }, { status: 404 });
    }
    
    // Verificar se já existem configurações
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userProfile.id)
      .single();
    
    let result;
    if (existingSettings) {
      // Atualizar configurações existentes
      const { data, error } = await supabase
        .from('user_settings')
        .update(validatedData)
        .eq('user_id', userProfile.id)
        .select()
        .single();
      
      if (error) {
        console.error('🔴 Erro ao atualizar configurações:', error);
        return NextResponse.json(
          { error: 'Erro ao atualizar configurações', details: error.message },
          { status: 500 }
        );
      }
      
      result = data;
    } else {
      // Criar novas configurações
      const { data, error } = await supabase
        .from('user_settings')
        .insert({
          user_id: userProfile.id,
          ...validatedData
        })
        .select()
        .single();
      
      if (error) {
        console.error('🔴 Erro ao criar configurações:', error);
        return NextResponse.json(
          { error: 'Erro ao criar configurações', details: error.message },
          { status: 500 }
        );
      }
      
      result = data;
    }
    
    // Remover campos internos da resposta
    const { id, user_id, created_at, updated_at, ...userSettings } = result;
    
    console.log('🔵 API Settings PUT - Configurações salvas:', userSettings);
    
    return NextResponse.json({
      success: true,
      message: 'Configurações salvas com sucesso',
      settings: userSettings
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }
    
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
