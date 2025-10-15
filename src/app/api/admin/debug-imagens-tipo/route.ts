import { NextResponse } from 'next/server';

// Copiar a estrutura IMAGENS_POR_TIPO do script principal
const IMAGENS_POR_TIPO = {
  apartamento: {
    exterior: [
      {
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&q=80',
        titulo: 'Fachada Moderna',
        descricao: 'Fachada contemporânea com design elegante'
      }
    ],
    interior: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&q=80',
        titulo: 'Sala de Estar',
        descricao: 'Sala espaçosa com muita luz natural'
      }
    ]
  }
};

export async function POST() {
  try {
    console.log('🔍 Testando estrutura IMAGENS_POR_TIPO...');

    const tipoImovel = 'apartamento';
    const imagensTipo = IMAGENS_POR_TIPO[tipoImovel as keyof typeof IMAGENS_POR_TIPO];
    
    console.log('📋 Tipo de imóvel:', tipoImovel);
    console.log('📋 Imagens tipo encontradas:', !!imagensTipo);
    
    if (!imagensTipo) {
      return NextResponse.json({
        success: false,
        message: 'Tipo de imóvel não encontrado',
        tipoImovel
      });
    }

    // Lógica de seleção (copiada do script principal)
    const todasImagens = [];
    Object.entries(imagensTipo).forEach(([categoria, imagens]) => {
      console.log(`📂 Processando categoria: ${categoria} com ${imagens.length} imagens`);
      imagens.forEach(imagem => {
        todasImagens.push({ ...imagem, categoria });
      });
    });

    console.log(`📊 Total de imagens disponíveis: ${todasImagens.length}`);

    // Quantidade aleatória entre 3 e 12
    const quantidadeImagens = Math.floor(Math.random() * 10) + 3;
    console.log(`🎲 Quantidade desejada: ${quantidadeImagens}`);

    // Seleção inteligente
    const imagensSelecionadas = [];
    
    // 1. SEMPRE incluir pelo menos 1 imagem exterior
    const imagensExterior = todasImagens.filter(img => img.categoria === 'exterior');
    console.log(`🏢 Imagens exterior disponíveis: ${imagensExterior.length}`);
    
    if (imagensExterior.length > 0) {
      const imagemExterior = imagensExterior[Math.floor(Math.random() * imagensExterior.length)];
      imagensSelecionadas.push(imagemExterior);
      console.log(`✅ Selecionada imagem exterior: ${imagemExterior.titulo}`);
    }
    
    // 2. SEMPRE incluir pelo menos 1 imagem interior
    const imagensInterior = todasImagens.filter(img => img.categoria === 'interior');
    console.log(`🏠 Imagens interior disponíveis: ${imagensInterior.length}`);
    
    if (imagensInterior.length > 0) {
      const imagemInterior = imagensInterior[Math.floor(Math.random() * imagensInterior.length)];
      imagensSelecionadas.push(imagemInterior);
      console.log(`✅ Selecionada imagem interior: ${imagemInterior.titulo}`);
    }
    
    // 3. Preencher o resto
    const imagensDisponiveis = todasImagens.filter(img => 
      !imagensSelecionadas.some(sel => sel.url === img.url)
    );
    
    console.log(`🔄 Imagens disponíveis para preenchimento: ${imagensDisponiveis.length}`);
    
    const imagensEmbaralhadas = imagensDisponiveis.sort(() => Math.random() - 0.5);
    const imagensAdicionais = imagensEmbaralhadas.slice(0, Math.max(0, quantidadeImagens - imagensSelecionadas.length));
    
    imagensSelecionadas.push(...imagensAdicionais);
    
    console.log(`🎯 Total de imagens selecionadas: ${imagensSelecionadas.length}`);

    return NextResponse.json({
      success: true,
      message: 'Estrutura de imagens funcionando!',
      debug: {
        tipoImovel,
        imagensDisponiveis: todasImagens.length,
        imagensSelecionadas: imagensSelecionadas.length,
        quantidadeDesejada: quantidadeImagens,
        selecionadas: imagensSelecionadas.map(img => ({
          titulo: img.titulo,
          categoria: img.categoria,
          url: img.url.substring(0, 50) + '...'
        }))
      }
    });

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro no teste',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

