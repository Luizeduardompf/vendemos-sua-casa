import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Tentar inserir um registro mínimo para ver quais colunas existem
    const { data, error } = await supabase
      .from('imoveis')
      .select('*')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        error: 'Erro ao consultar tabela',
        details: error
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Colunas da tabela imoveis',
      columns: data && data.length > 0 ? Object.keys(data[0]) : [],
      sample_data: data
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Erro interno',
      details: error.message
    });
  }
}
