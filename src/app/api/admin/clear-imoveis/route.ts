import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Deletar todas as mídias primeiro (devido à foreign key)
    const { error: mediaError } = await supabase
      .from('imoveis_media')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletar todos

    if (mediaError) {
      console.log('Erro ao deletar mídias:', mediaError);
    }

    // Deletar todas as comodidades
    const { error: amenitiesError } = await supabase
      .from('imoveis_amenities')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletar todos

    if (amenitiesError) {
      console.log('Erro ao deletar comodidades:', amenitiesError);
    }

    // Deletar todos os imóveis
    const { error: imoveisError } = await supabase
      .from('imoveis')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletar todos

    if (imoveisError) {
      console.log('Erro ao deletar imóveis:', imoveisError);
      return NextResponse.json(
        { error: 'Erro ao deletar imóveis: ' + imoveisError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Imóveis limpos com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao limpar imóveis:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + error.message },
      { status: 500 }
    );
  }
}
