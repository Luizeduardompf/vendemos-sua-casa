import { NextResponse } from 'next/server';
import { createClientWithCookies } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = await createClientWithCookies();
    
    // Listar todos os usuários da tabela users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, user_type, created_at')
      .limit(10);

    if (usersError) {
      return NextResponse.json({
        error: 'Erro ao buscar usuários',
        details: usersError.message
      });
    }

    return NextResponse.json({
      totalUsers: users?.length || 0,
      users: users || []
    });
  } catch (error) {
    console.error('Erro na API debug list-users:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

