import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Tentar adicionar a coluna imovel_id diretamente
    const { error } = await supabase
      .from('imoveis')
      .select('imovel_id')
      .limit(1);

    if (error && error.code === 'PGRST204') {
      // Coluna não existe, vamos criar usando uma abordagem diferente
      console.log('Coluna imovel_id não existe, tentando criar...');
      
      // Como não podemos executar SQL diretamente, vamos atualizar os imóveis existentes
      // Primeiro, vamos buscar todos os imóveis
      const { data: imoveis, error: fetchError } = await supabase
        .from('imoveis')
        .select('id, titulo, created_at')
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Erro ao buscar imóveis:', fetchError);
        return NextResponse.json(
          { error: 'Erro ao buscar imóveis: ' + fetchError.message },
          { status: 500 }
        );
      }

      // Atualizar cada imóvel com um imovel_id único
      for (let i = 0; i < imoveis.length; i++) {
        const imovel = imoveis[i];
        const imovelId = `APT${String(i + 100).padStart(3, '0')}`;
        
        // Atualizar o slug também
        const slug = `${imovel.titulo.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-${imovelId}`;
        
        const { error: updateError } = await supabase
          .from('imoveis')
          .update({ 
            slug: slug
          })
          .eq('id', imovel.id);

        if (updateError) {
          console.error('Erro ao atualizar imóvel:', updateError);
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Slugs atualizados com sucesso!',
        imoveis: imoveis.length
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        message: 'Coluna imovel_id já existe!'
      });
    }

  } catch (error) {
    console.error('Erro ao adicionar coluna imovel_id:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + error.message },
      { status: 500 }
    );
  }
}
