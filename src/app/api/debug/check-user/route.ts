import { NextResponse } from 'next/server';
import { createClientWithCookies } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = await createClientWithCookies();
    
    // Tentar obter usuário via cookies
    let { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Se não conseguir via cookies, tentar via Authorization header
    if (authError || !user) {
      return NextResponse.json({
        error: 'Usuário não autenticado',
        authError: authError?.message
      });
    }

    // Buscar dados do usuário na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    // Se não encontrar, tentar buscar por email
    let userDataByEmail = null;
    if (userError || !userData) {
      const { data: userByEmail, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
      
      userDataByEmail = userByEmail;
    }

    return NextResponse.json({
      authUser: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      userData: userData || null,
      userDataByEmail: userDataByEmail || null,
      userError: userError?.message,
      userFound: !!(userData || userDataByEmail)
    });
  } catch (error) {
    console.error('Erro na API debug check-user:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

