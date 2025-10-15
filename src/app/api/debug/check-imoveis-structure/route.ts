import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Buscar estrutura da tabela imoveis
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .select('*')
      .limit(1);

    if (imoveisError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar estrutura da tabela imoveis',
        details: imoveisError.message
      });
    }

    return NextResponse.json({
      success: true,
      structure: imoveis?.[0] || {},
      columns: imoveis?.[0] ? Object.keys(imoveis[0]) : []
    });
  } catch (error) {
    console.error('Erro na API debug check-imoveis-structure:', error);
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

