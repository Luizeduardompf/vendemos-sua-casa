import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();

    // Buscar informações sobre a coluna status
    const { data: columnInfo, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_name', 'imoveis')
      .eq('column_name', 'status');

    if (columnError) {
      console.error('Erro ao buscar info da coluna:', columnError);
    }

    // Tentar buscar a constraint check diretamente
    const { data: checkConstraints, error: checkError } = await supabase
      .from('information_schema.check_constraints')
      .select('*')
      .ilike('constraint_name', '%status%');

    if (checkError) {
      console.error('Erro ao buscar check constraints:', checkError);
    }

    // Buscar constraints da tabela imoveis
    const { data: tableConstraints, error: tableError } = await supabase
      .from('information_schema.table_constraints')
      .select('*')
      .eq('table_name', 'imoveis');

    if (tableError) {
      console.error('Erro ao buscar table constraints:', tableError);
    }

    return NextResponse.json({
      columnInfo: columnInfo || [],
      checkConstraints: checkConstraints || [],
      tableConstraints: tableConstraints || [],
      message: 'Informações sobre constraints da tabela imoveis'
    });

  } catch (error) {
    console.error('Erro na API de debug:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
