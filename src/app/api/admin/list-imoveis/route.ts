import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Buscar todos os imóveis com seus dados
    const { data: imoveis, error } = await supabase
      .from('imoveis')
      .select(`
        id,
        slug,
        titulo,
        imovel_id,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Erro ao buscar imóveis:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar imóveis: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      imoveis: imoveis,
      total: imoveis?.length || 0
    });

  } catch (error) {
    console.error('Erro ao listar imóveis:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + error.message },
      { status: 500 }
    );
  }
}
