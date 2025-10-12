import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    console.log('🔵 API Settings Bypass GET - Iniciando...');
    
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
      
      console.log('🔵 API Settings Bypass GET - Usando configurações padrão');
      return NextResponse.json({
        success: true,
        settings: defaultSettings
      });
    }
    
    // Remover campos internos da resposta
    const { id, user_id, created_at, updated_at, ...userSettings } = settings;
    
    console.log('🔵 API Settings Bypass GET - Configurações carregadas:', userSettings);
    
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

export async function PUT(request: NextRequest) {
  try {
    console.log('🔵 API Settings Bypass PUT - Iniciando...');
    
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
    console.log('🔵 API Settings Bypass PUT - Body recebido:', body);
    
    // Validar dados recebidos
    const validatedData = settingsSchema.parse(body);
    console.log('🔵 API Settings Bypass PUT - Dados validados:', validatedData);
    
    // Buscar perfil do utilizador
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();
    
    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'Perfil do utilizador não encontrado' }, { status: 404 });
    }
    
    // Usar RPC para contornar RLS
    const { data: result, error: rpcError } = await supabase.rpc('upsert_user_settings', {
      p_user_id: userProfile.id,
      p_modo_escuro: validatedData.modo_escuro,
      p_tema_cor: validatedData.tema_cor,
      p_tamanho_fonte: validatedData.tamanho_fonte,
      p_compacto: validatedData.compacto,
      p_animacoes: validatedData.animacoes,
      p_notificacoes_email: validatedData.notificacoes_email,
      p_notificacoes_push: validatedData.notificacoes_push,
      p_notificacoes_sms: validatedData.notificacoes_sms,
      p_som_notificacoes: validatedData.som_notificacoes,
      p_vibracao: validatedData.vibracao,
      p_idioma: validatedData.idioma,
      p_fuso_horario: validatedData.fuso_horario,
      p_privacidade_perfil: validatedData.privacidade_perfil,
      p_marketing_emails: validatedData.marketing_emails
    });
    
    if (rpcError) {
      console.error('🔴 Erro RPC:', rpcError);
      
      // Se RPC falhar, tentar inserção direta com bypass de RLS
      const { data: directResult, error: directError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userProfile.id,
          ...validatedData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();
      
      if (directError) {
        console.error('🔴 Erro inserção direta:', directError);
        return NextResponse.json(
          { 
            error: 'Erro ao salvar configurações',
            details: directError.message
          },
          { status: 500 }
        );
      }
      
      console.log('🔵 API Settings Bypass PUT - Configurações salvas via inserção direta:', directResult);
      
      // Remover campos internos da resposta
      const { id, user_id, created_at, updated_at, ...userSettings } = directResult;
      
      return NextResponse.json({
        success: true,
        message: 'Configurações salvas com sucesso',
        settings: userSettings
      });
    }
    
    console.log('🔵 API Settings Bypass PUT - Configurações salvas via RPC:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Configurações salvas com sucesso',
      settings: validatedData
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
