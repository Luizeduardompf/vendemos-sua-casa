import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 API Reset Configurações - Iniciando...');
    
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
    
    // Verificar se já existem configurações para este utilizador
    const { data: existingConfig, error: existingError } = await supabase
      .from('user_configuracoes')
      .select('*')
      .eq('user_id', userProfile.id)
      .single();
    
    if (existingConfig && !existingError) {
      // Atualizar para configurações padrão
      const { data: updatedConfig, error: updateError } = await supabase
        .from('user_configuracoes')
        .update({
          configuracoes: defaultConfig,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userProfile.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Erro ao resetar configurações:', updateError);
        return NextResponse.json(
          { error: 'Erro ao resetar configurações' },
          { status: 500 }
        );
      }
      
      console.log('🔵 API Reset Configurações - Configurações resetadas:', updatedConfig);
      
      return NextResponse.json({
        success: true,
        message: 'Configurações resetadas para os valores padrão',
        configuracoes: defaultConfig
      });
      
    } else {
      // Criar configurações padrão
      const { data: newConfig, error: createError } = await supabase
        .from('user_configuracoes')
        .insert({
          user_id: userProfile.id,
          configuracoes: defaultConfig,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Erro ao criar configurações padrão:', createError);
        return NextResponse.json(
          { error: 'Erro ao criar configurações padrão' },
          { status: 500 }
        );
      }
      
      console.log('🔵 API Reset Configurações - Configurações padrão criadas:', newConfig);
      
      return NextResponse.json({
        success: true,
        message: 'Configurações padrão criadas com sucesso',
        configuracoes: defaultConfig
      });
    }
    
  } catch (error) {
    console.error('Erro ao resetar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
