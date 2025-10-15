import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Buscar um imóvel e seus dados do proprietário
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
    
    // Buscar dados completos do proprietário
    const { data: proprietario, error: proprietarioError } = await supabase
      .from('users')
      .select('*')
      .eq('id', imovel.proprietario_id)
      .single();
    
    console.log('🔍 Imóvel:', imovel);
    console.log('🔍 Proprietário completo:', proprietario);
    
    // Simular a formatação da API principal
    const proprietarioFormatado = {
      nome: proprietario?.nome_exibicao || proprietario?.nome_completo || 'Proprietário',
      telefone: proprietario?.telefone || '+351 123 456 789',
      email: proprietario?.email,
      foto: proprietario?.foto_perfil || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      tipo: proprietario?.user_type
    };
    
    console.log('🔍 Proprietário formatado:', proprietarioFormatado);
    
    return NextResponse.json({
      imovel,
      proprietario: proprietarioFormatado,
      proprietarioError
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
