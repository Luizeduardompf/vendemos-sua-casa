import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Verificar estrutura da tabela users
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      users: users,
      count: users.length,
      sampleUser: users[0] || null
    });
    
  } catch (error) {
    console.error('Erro ao verificar tabela users:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

