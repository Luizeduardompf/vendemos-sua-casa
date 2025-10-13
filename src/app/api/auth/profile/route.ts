import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔵 API Profile - Iniciando...');
    
    // Obter o token de autorização do header
    const authHeader = request.headers.get('authorization');
    console.log('🔵 API Profile - Auth Header:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('🔵 API Profile - Token não encontrado no header');
      return NextResponse.json(
        { error: 'Token de autorização não encontrado' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    console.log('🔵 API Profile - Token extraído:', token ? 'Sim' : 'Não');
    
    const supabase = createClient();
    
    // Tentar obter a sessão atual primeiro
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔵 API Profile - Session:', session ? 'Encontrada' : 'Não encontrada');
    console.log('🔵 API Profile - Session Error:', sessionError);
    
    let authUser = null;
    
    if (session?.user) {
      // Usar sessão atual se disponível
      authUser = session.user;
      console.log('🔵 API Profile - Usando sessão atual');
    } else {
      // Tentar validar o token fornecido
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      console.log('🔵 API Profile - User do token:', user ? 'Encontrado' : 'Não encontrado');
      console.log('🔵 API Profile - User Error:', userError);
      
      if (userError || !user) {
        return NextResponse.json(
          { error: 'Token inválido ou expirado' },
          { status: 401 }
        );
      }
      
      authUser = user;
    }
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }
    
    // Buscar perfil do utilizador
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .maybeSingle();
    
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
    
    return NextResponse.json({
      success: true,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        nome_completo: userProfile.nome_completo,
        telefone: userProfile.telefone,
        user_type: userProfile.user_type,
        admin_level: userProfile.admin_level,
        is_verified: userProfile.is_verified,
        is_active: userProfile.is_active,
        nif: userProfile.nif,
        tipo_pessoa: userProfile.tipo_pessoa,
        ami: userProfile.ami,
        nome_empresa: userProfile.nome_empresa,
        ami_empresa: userProfile.ami_empresa,
        imobiliaria_id: userProfile.imobiliaria_id,
        morada: userProfile.morada,
        codigo_postal: userProfile.codigo_postal,
        localidade: userProfile.localidade,
        distrito: userProfile.distrito,
        aceita_termos: userProfile.aceita_termos,
        aceita_privacidade: userProfile.aceita_privacidade,
        aceita_marketing: userProfile.aceita_marketing,
        created_at: userProfile.created_at,
        updated_at: userProfile.updated_at,
        last_login: userProfile.last_login,
        // Novos campos do Google
        foto_perfil: userProfile.foto_perfil,
        primeiro_nome: userProfile.primeiro_nome,
        ultimo_nome: userProfile.ultimo_nome,
        nome_exibicao: userProfile.nome_exibicao,
        provedor: userProfile.provedor,
        provedor_id: userProfile.provedor_id,
        localizacao: userProfile.localizacao,
        email_verificado: userProfile.email_verificado,
        dados_sociais: userProfile.dados_sociais,
        foto_manual: userProfile.foto_manual || false
      }
    });
    
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔵 API Profile PUT - Iniciando...');
    
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
    
    // Campos que podem ser atualizados
    const allowedFields = [
      'nome_completo',
      'telefone',
      'nif',
      'tipo_pessoa',
      'ami',
      'nome_empresa',
      'ami_empresa',
      'morada',
      'codigo_postal',
      'localidade',
      'distrito',
      'aceita_marketing',
      // Novos campos do Google
      'foto_perfil',
      'primeiro_nome',
      'ultimo_nome',
      'nome_exibicao',
      'provedor',
      'provedor_id',
      'localizacao',
      'email_verificado',
      'dados_sociais',
      'foto_manual'
    ];
    
    // Filtrar apenas campos permitidos
    const updateData = Object.keys(body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = body[key];
        return obj;
      }, {} as Record<string, unknown>);
    
    // Verificar se NIF já existe (se fornecido)
    if (updateData.nif) {
      const { data: existingNIF } = await supabase
        .from('users')
        .select('id')
        .eq('nif', updateData.nif)
        .neq('auth_user_id', user.id)
        .single();
      
      if (existingNIF) {
        return NextResponse.json(
          { error: 'NIF já está registado' },
          { status: 400 }
        );
      }
    }
    
    // Verificar se AMI já existe (se fornecido)
    if (updateData.ami) {
      const { data: existingAMI } = await supabase
        .from('users')
        .select('id')
        .eq('ami', updateData.ami)
        .neq('auth_user_id', user.id)
        .single();
      
      if (existingAMI) {
        return NextResponse.json(
          { error: 'AMI já está registado' },
          { status: 400 }
        );
      }
    }
    
    // Atualizar perfil
    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('auth_user_id', user.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError);
      return NextResponse.json(
        { error: 'Erro ao atualizar perfil' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: {
        id: updatedProfile.id,
        email: updatedProfile.email,
        nome_completo: updatedProfile.nome_completo,
        telefone: updatedProfile.telefone,
        user_type: updatedProfile.user_type,
        admin_level: updatedProfile.admin_level,
        is_verified: updatedProfile.is_verified,
        is_active: updatedProfile.is_active,
        nif: updatedProfile.nif,
        tipo_pessoa: updatedProfile.tipo_pessoa,
        ami: updatedProfile.ami,
        nome_empresa: updatedProfile.nome_empresa,
        ami_empresa: updatedProfile.ami_empresa,
        imobiliaria_id: updatedProfile.imobiliaria_id,
        morada: updatedProfile.morada,
        codigo_postal: updatedProfile.codigo_postal,
        localidade: updatedProfile.localidade,
        distrito: updatedProfile.distrito,
        aceita_termos: updatedProfile.aceita_termos,
        aceita_privacidade: updatedProfile.aceita_privacidade,
        aceita_marketing: updatedProfile.aceita_marketing,
        created_at: updatedProfile.created_at,
        updated_at: updatedProfile.updated_at,
        last_login: updatedProfile.last_login
      }
    });
    
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
