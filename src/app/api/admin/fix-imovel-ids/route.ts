import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Buscar todos os imóveis
    const { data: imoveis, error: fetchError } = await supabase
      .from('imoveis')
      .select('id, slug');
    
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
    
    // Extrair ID do slug e atualizar cada imóvel
    const updates = [];
    const errors = [];
    
    for (const imovel of imoveis) {
      if (!imovel.slug) {
        errors.push({ id: imovel.id, error: 'Slug vazio' });
        continue;
      }
      
      // Extrair o ID do final do slug (formato: ABC-123)
      const match = imovel.slug.match(/([A-Z]{3}-[0-9]{3})$/);
      
      if (!match) {
        errors.push({ id: imovel.id, slug: imovel.slug, error: 'ID não encontrado no slug' });
        continue;
      }
      
      const imovelId = match[1];
      
      // Atualizar o registro
      const { error: updateError } = await supabase
        .from('imoveis')
        .update({ imovel_id: imovelId })
        .eq('id', imovel.id);
      
      if (updateError) {
        errors.push({ id: imovel.id, error: updateError.message });
      } else {
        updates.push({ id: imovel.id, imovel_id: imovelId });
      }
    }
    
    return NextResponse.json({
      message: 'IDs atualizados com sucesso',
      total: imoveis.length,
      atualizados: updates.length,
      erros: errors.length,
      updates,
      errors
    });
    
  } catch (error) {
    console.error('Erro ao corrigir IDs:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

