import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Buscar um usuário para ver os campos disponíveis
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError || !users || users.length === 0) {
      return NextResponse.json({ error: 'Nenhum usuário encontrado' }, { status: 404 });
    }
    
    console.log('🔍 Usuário encontrado:', users[0]);
    
    return NextResponse.json({
      user: users[0],
      fields: Object.keys(users[0])
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
