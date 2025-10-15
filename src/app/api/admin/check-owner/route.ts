import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Buscar imóvel e proprietário
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select(`
        id,
        imovel_id,
        titulo,
        proprietario_id
      `)
      .eq('imovel_id', 'MXP-128')
      .single();
    
    if (imovelError) {
      return NextResponse.json({ error: imovelError.message }, { status: 500 });
    }
    
    // Buscar dados do proprietário
    const { data: proprietario, error: proprietarioError } = await supabase
      .from('users')
      .select('id, email, nome_exibicao')
      .eq('id', imovel.proprietario_id)
      .single();
    
    console.log('🔍 Imóvel:', imovel);
    console.log('🔍 Proprietário:', proprietario);
    
    return NextResponse.json({
      imovel,
      proprietario,
      proprietarioError
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
