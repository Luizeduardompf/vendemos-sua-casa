import { NextRequest, NextResponse } from 'next/server';
import { createBrowserClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const { email, password, provider } = await request.json();

    if (!email || !password || !provider) {
      return NextResponse.json(
        { error: 'Email, senha e provedor são obrigatórios' },
        { status: 400 }
      );
    }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Verificar se já existe usuário com este email
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (userError) {
      console.error('Erro ao buscar usuário:', userError);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Nenhuma conta encontrada com este email' },
        { status: 404 }
      );
    }

    // Verificar se já tem este provedor vinculado
    if (existingUser.provedor === provider) {
      return NextResponse.json(
        { error: `Esta conta já está vinculada ao ${provider}` },
        { status: 400 }
      );
    }

    // Se tem conta com email/senha, tentar fazer login
    if (existingUser.provedor === 'email') {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return NextResponse.json(
          { error: 'Email ou senha incorretos' },
          { status: 401 }
        );
      }

      // Atualizar provedor para incluir ambos
      const { error: updateError } = await supabase
        .from('users')
        .update({
          provedor: 'email,google', // ou outro formato
          dados_sociais: {
            ...existingUser.dados_sociais,
            linked_providers: ['email', provider]
          }
        })
        .eq('id', existingUser.id);

      if (updateError) {
        console.error('Erro ao atualizar provedor:', updateError);
        return NextResponse.json(
          { error: 'Erro ao vincular conta' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Conta vinculada com sucesso!',
        user: authData.user
      });
    }

    // Se tem conta social, sugerir login social
    return NextResponse.json(
      { 
        error: 'Esta conta está vinculada ao Google. Use o login social.',
        provider: existingUser.provedor,
        suggestion: 'social_login'
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Erro ao vincular conta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
