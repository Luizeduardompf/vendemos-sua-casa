import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Buscar todos os usuários para ver a estrutura
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar usuários',
        details: usersError.message
      });
    }

    return NextResponse.json({
      success: true,
      totalUsers: users?.length || 0,
      users: users || [],
      sampleUser: users?.[0] || null
    });
  } catch (error) {
    console.error('Erro na API debug check-user-structure:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

