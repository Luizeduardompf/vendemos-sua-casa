import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    console.log('🔵 API Configurações Simple PUT - Iniciando...');
    
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
    console.log('🔵 API Configurações Simple PUT - Body recebido:', body);
    
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
    
    console.log('🔵 API Configurações Simple PUT - Configurações válidas:', validConfigs);
    
    // Usar RPC para contornar RLS
    const { data: result, error: rpcError } = await supabase.rpc('upsert_user_configuracoes', {
      p_user_id: userProfile.id,
      p_configuracoes: validConfigs
    });
    
    if (rpcError) {
      console.error('🔴 Erro RPC:', rpcError);
      
      // Se RPC falhar, tentar inserção direta simples
      const { data: directResult, error: directError } = await supabase
        .from('user_configuracoes')
        .insert({
          user_id: userProfile.id,
          configuracoes: validConfigs,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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
      
      console.log('🔵 API Configurações Simple PUT - Configurações salvas via inserção direta:', directResult);
      
      return NextResponse.json({
        success: true,
        message: 'Configurações salvas com sucesso',
        configuracoes: validConfigs
      });
    }
    
    console.log('🔵 API Configurações Simple PUT - Configurações salvas via RPC:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Configurações salvas com sucesso',
      configuracoes: validConfigs
    });
    
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
