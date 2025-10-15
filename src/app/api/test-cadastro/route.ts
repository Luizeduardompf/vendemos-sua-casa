import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Dados de teste
    const testData = {
      titulo: 'Teste API',
      descricao: 'Teste de cadastro via API',
      preco: '100000',
      area: '100',
      quartos: '2',
      banheiros: '1',
      endereco: 'Rua Teste',
      cidade: 'Lisboa',
      distrito: 'Lisboa',
      tipo_imovel: 'apartamento',
      tipo_negocio: 'venda'
    };

    // Simular dados do usuário (usar um ID existente da tabela users)
    const userId = 'a8221101-9a56-422c-aee1-002fff297ff1'; // ID de um usuário existente
    
    // Gerar ID e slug
    const { generateImovelId } = await import('@/lib/imovel-id');
    const { createImovelSlug } = await import('@/lib/slug');
    
    const imovelId = generateImovelId();
    const slug = createImovelSlug(testData.titulo, imovelId);
    
    const imovelData = {
      imovel_id: imovelId,
      slug: slug,
      proprietario_id: userId,
      titulo: testData.titulo,
      descricao: testData.descricao,
      tipo_imovel: testData.tipo_imovel,
      categoria: testData.tipo_negocio,
      preco_venda: parseFloat(testData.preco),
      morada: testData.endereco,
      localidade: testData.cidade,
      distrito: testData.distrito,
      area_total: parseFloat(testData.area),
      quartos: parseInt(testData.quartos),
      casas_banho: parseInt(testData.banheiros),
      status: 'pendente',
      visibilidade: 'privado'
    };

    // Inserir imóvel
    const { data: imovelInserido, error: imovelError } = await supabase
      .from('imoveis')
      .insert(imovelData)
      .select()
      .single();

    if (imovelError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao inserir imóvel',
        details: imovelError.message
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Imóvel cadastrado com sucesso!',
      imovel: imovelInserido
    });

  } catch (error) {
    console.error('Erro no teste de cadastro:', error);
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
