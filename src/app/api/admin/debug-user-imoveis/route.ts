import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Buscar todos os usuários
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .limit(5);

    if (usersError) {
      return NextResponse.json({ error: 'Erro ao buscar usuários: ' + usersError.message }, { status: 500 });
    }

    // Para cada usuário, buscar seus imóveis
    const usersWithImoveis = [];
    for (const user of users) {
      const { data: imoveis, error: imoveisError } = await supabase
        .from('imoveis')
        .select('id, slug, titulo, created_at')
        .eq('proprietario_id', user.id)
        .order('created_at', { ascending: false });

      usersWithImoveis.push({
        user: user,
        imoveis: imoveis || [],
        imoveisCount: imoveis?.length || 0
      });
    }

    return NextResponse.json({ 
      success: true, 
      usersWithImoveis: usersWithImoveis
    });

  } catch (error) {
    console.error('Erro ao debug usuários e imóveis:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + error.message },
      { status: 500 }
    );
  }
}
