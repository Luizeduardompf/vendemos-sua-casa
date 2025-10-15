import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { createImovelSlug } from '@/lib/slug';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Buscar todos os imóveis com imovel_id
    const { data: imoveis, error: fetchError } = await supabase
      .from('imoveis')
      .select('id, titulo, imovel_id, slug')
      .not('imovel_id', 'is', null);
    
    if (fetchError) {
      return NextResponse.json(
        { error: 'Erro ao buscar imóveis', details: fetchError },
        { status: 500 }
      );
    }
    
    if (!imoveis || imoveis.length === 0) {
      return NextResponse.json(
        { message: 'Nenhum imóvel encontrado' },
        { status: 200 }
      );
    }
    
    console.log(`Encontrados ${imoveis.length} imóveis para regenerar slugs`);
    
    // Atualizar cada imóvel individualmente
    const updates = [];
    const errors = [];
    
    for (const imovel of imoveis) {
      if (!imovel.imovel_id) {
        errors.push({ id: imovel.id, error: 'imovel_id vazio' });
        continue;
      }
      
      // Gerar novo slug usando o imovel_id
      const newSlug = createImovelSlug(imovel.titulo, imovel.imovel_id);
      
      console.log(`Atualizando ${imovel.id}: ${imovel.slug} -> ${newSlug}`);
      
      // Atualizar o registro
      const { error: updateError } = await supabase
        .from('imoveis')
        .update({ slug: newSlug })
        .eq('id', imovel.id);
      
      if (updateError) {
        console.error(`Erro ao atualizar imóvel ${imovel.id}:`, updateError);
        errors.push({ id: imovel.id, error: updateError.message });
      } else {
        updates.push({ id: imovel.id, old_slug: imovel.slug, new_slug: newSlug });
      }
    }
    
    return NextResponse.json({
      message: 'Slugs regenerados com sucesso',
      total: imoveis.length,
      atualizados: updates.length,
      erros: errors.length,
      updates: updates.slice(0, 10), // Mostrar apenas os primeiros 10
      errors: errors.slice(0, 10) // Mostrar apenas os primeiros 10
    });
    
  } catch (error) {
    console.error('Erro ao regenerar slugs:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}

