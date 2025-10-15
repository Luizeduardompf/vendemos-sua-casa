import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Verificar estrutura da tabela imoveis_media
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'imoveis_media');
    
    console.log('🔍 Colunas da tabela imoveis_media:', columns);
    console.log('🔍 Erro nas colunas:', columnsError);
    
    return NextResponse.json({
      columns: columns || [],
      columnsError
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
