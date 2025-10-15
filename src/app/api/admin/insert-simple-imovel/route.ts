import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Buscar um usuário proprietário
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .eq('user_type', 'proprietario')
      .limit(1);

    if (usersError || !users || users.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum usuário proprietário encontrado' },
        { status: 404 }
      );
    }

    const proprietarioId = users[0].id;

    // Inserir um imóvel simples
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .insert({
        proprietario_id: proprietarioId,
        titulo: 'Apartamento T2 com Varanda',
        descricao: 'Apartamento moderno com excelente localização',
        slug: 'apartamento-t2-varanda-1',
        tipo_imovel: 'apartamento',
        categoria: 'venda',
        preco_venda: 250000,
        morada: 'Rua das Flores, 123',
        codigo_postal: '1000-001',
        localidade: 'Lisboa',
        distrito: 'Lisboa',
        freguesia: 'Santo António',
        area_total: 85,
        area_util: 85,
        quartos: 2,
        casas_banho: 1,
        status: 'publicado',
        visibilidade: 'publico'
      })
      .select()
      .single();

    if (imovelError) {
      console.error('Erro ao inserir imóvel:', imovelError);
      return NextResponse.json(
        { error: 'Erro ao inserir imóvel: ' + imovelError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Imóvel inserido com sucesso',
      imovel: imovel
    });

  } catch (error) {
    console.error('Erro ao inserir imóvel:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + error.message },
      { status: 500 }
    );
  }
}
