import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Função para gerar URLs únicas do Unsplash com parâmetros aleatórios
function gerarUrlUnicaUnsplash(photoId: string, width: number = 800, height: number = 600, quality: number = 80) {
  const timestamp = Date.now();
  const randomSeed = Math.floor(Math.random() * 1000000);
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&q=${quality}&t=${timestamp}&s=${randomSeed}`;
}

// Banco de imagens com IDs únicos do Unsplash
const IMAGENS_BASE = {
  apartamento: {
    exterior: [
      { photoId: '1545324418-cc1a3fa10c00', titulo: 'Fachada Principal', descricao: 'Fachada moderna do edifício com arquitetura contemporânea' },
      { photoId: '1560448204-e02f11c3d0e2', titulo: 'Vista do Edifício', descricao: 'Vista panorâmica do edifício e arredores' },
      { photoId: '1570129477492-45c003edd2be', titulo: 'Entrada Principal', descricao: 'Entrada elegante com portaria e receção' },
      { photoId: '1583608205776-bfd35f0d9f83', titulo: 'Vista da Rua', descricao: 'Vista da rua mostrando a localização privilegiada' },
      { photoId: '1564013799919-ab600027ffc6', titulo: 'Edifício Moderno', descricao: 'Arquitetura contemporânea com design elegante' },
      { photoId: '1545324418-cc1a3fa10c00', titulo: 'Fachada Clássica', descricao: 'Fachada tradicional com elementos modernos' },
      { photoId: '1560448204-e02f11c3d0e2', titulo: 'Vista Panorâmica', descricao: 'Vista ampla do edifício e entorno' },
      { photoId: '1570129477492-45c003edd2be', titulo: 'Entrada Elegante', descricao: 'Entrada principal com design sofisticado' },
      { photoId: '1583608205776-bfd35f0d9f83', titulo: 'Localização Privilegiada', descricao: 'Vista da rua mostrando a excelente localização' },
      { photoId: '1564013799919-ab600027ffc6', titulo: 'Arquitetura Contemporânea', descricao: 'Design moderno e funcional' }
    ],
    interior: [
      { photoId: '1586023492125-27b2c045efd7', titulo: 'Sala de Estar', descricao: 'Sala espaçosa com muita luz natural e acabamentos modernos' },
      { photoId: '1556909114-f6e7ad7d3136', titulo: 'Cozinha Principal', descricao: 'Cozinha equipada com eletrodomésticos modernos e ilha central' },
      { photoId: '1631889993952-431cc8e4d75e', titulo: 'Quarto Principal', descricao: 'Quarto amplo com roupeiro embutido e varanda privada' },
      { photoId: '1622372738946-62e02505feb3', titulo: 'Casa de Banho', descricao: 'Casa de banho completa com banheira e chuveiro' },
      { photoId: '1586023492125-27b2c045efd7', titulo: 'Quarto Secundário', descricao: 'Quarto secundário com roupeiro embutido' },
      { photoId: '1556909114-f6e7ad7d3136', titulo: 'Hall de Entrada', descricao: 'Hall de entrada amplo e bem iluminado' },
      { photoId: '1631889993952-431cc8e4d75e', titulo: 'Sala de Jantar', descricao: 'Sala de jantar elegante e funcional' },
      { photoId: '1622372738946-62e02505feb3', titulo: 'Lavabo', descricao: 'Lavabo moderno e prático' },
      { photoId: '1586023492125-27b2c045efd7', titulo: 'Corredor', descricao: 'Corredor amplo e bem iluminado' },
      { photoId: '1556909114-f6e7ad7d3136', titulo: 'Área de Serviço', descricao: 'Área de serviço completa e funcional' }
    ],
    varanda: [
      { photoId: '1560448204-e02f11c3d0e2', titulo: 'Varanda Principal', descricao: 'Varanda privada com vista para a cidade' },
      { photoId: '1583608205776-bfd35f0d9f83', titulo: 'Terraço', descricao: 'Terraço amplo com área de lazer' },
      { photoId: '1564013799919-ab600027ffc6', titulo: 'Varanda Lateral', descricao: 'Varanda lateral com vista privilegiada' },
      { photoId: '1545324418-cc1a3fa10c00', titulo: 'Área Externa', descricao: 'Área externa para relaxamento' }
    ]
  }
};

// Função para gerar imagens únicas para um imóvel
function gerarImagensUnicasParaImovel(imovelId: string, tipoImovel: string, quantidade: number) {
  const imagensTipo = IMAGENS_BASE[tipoImovel as keyof typeof IMAGENS_BASE] || IMAGENS_BASE.apartamento;
  
  // Combinar todas as imagens disponíveis
  const todasImagens = [];
  Object.entries(imagensTipo).forEach(([categoria, imagens]) => {
    imagens.forEach(imagem => {
      todasImagens.push({ ...imagem, categoria });
    });
  });

  // Embaralhar e pegar a quantidade desejada
  const imagensEmbaralhadas = todasImagens.sort(() => Math.random() - 0.5);
  const imagensSelecionadas = imagensEmbaralhadas.slice(0, Math.min(quantidade, todasImagens.length));

  // Gerar URLs únicas para cada imagem
  return imagensSelecionadas.map((imagem, index) => ({
    ...imagem,
    url: gerarUrlUnicaUnsplash(imagem.photoId),
    ordem: index + 1,
    principal: index === 0
  }));
}

// Função de download e upload (copiada do script original)
async function downloadAndUploadImage(
  supabase: any,
  imovelId: string,
  imageUrl: string,
  fileName: string,
  titulo: string,
  descricao: string,
  categoria: string,
  principal: boolean,
  ordem: number
) {
  try {
    console.log(`📥 Baixando: ${imageUrl}`);
    
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.error(`❌ Erro no download: ${response.status} ${response.statusText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log(`✅ Download concluído: ${arrayBuffer.byteLength} bytes`);

    // Verificar tamanho (máximo 3MB)
    if (arrayBuffer.byteLength > 3 * 1024 * 1024) {
      console.error(`❌ Imagem muito grande: ${arrayBuffer.byteLength} bytes`);
      return null;
    }

    console.log(`📤 Fazendo upload: ${fileName}`);
    
    // Fazer upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imoveis-images')
      .upload(fileName, arrayBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error(`❌ Erro no upload:`, uploadError);
      return null;
    }

    console.log(`✅ Upload concluído: ${uploadData.path}`);

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from('imoveis-images')
      .getPublicUrl(fileName);

    console.log(`🔗 URL pública: ${publicUrlData.publicUrl}`);

    // Inserir metadados na tabela
    const { data: mediaData, error: mediaError } = await supabase
      .from('imoveis_media')
      .insert({
        imovel_id: imovelId,
        url_publica: publicUrlData.publicUrl,
        principal: principal,
        ordem: ordem,
        descricao: descricao,
        nome_arquivo: fileName,
        caminho_arquivo: uploadData.path,
        tipo_media: 'foto',
        categoria: categoria,
        ativo: true
      })
      .select()
      .single();

    if (mediaError) {
      console.error(`❌ Erro ao inserir metadados:`, mediaError);
      return null;
    }

    console.log(`✅ Metadados inseridos: ${mediaData.id}`);
    return mediaData;

  } catch (error) {
    console.error(`❌ Erro geral:`, error);
    return null;
  }
}

export async function POST() {
  const supabase = createClient();
  
  try {
    console.log('🚀 Iniciando geração de imagens ÚNICAS com Supabase Storage...');
    console.log('📋 Processo: Limpar → Gerar URLs Únicas → Baixar → Armazenar → Associar');

    // 1. Buscar todos os imóveis
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .select('id, imovel_id, titulo, tipo_imovel');

    if (imoveisError) {
      console.error('Erro ao buscar imóveis:', imoveisError);
      return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 });
    }

    if (!imoveis || imoveis.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Nenhum imóvel encontrado para gerar imagens.' 
      });
    }

    console.log(`📊 Encontrados ${imoveis.length} imóveis para processar`);

    // 2. Limpar TODAS as imagens existentes
    console.log('🗑️ Limpando imagens existentes...');
    
    const { data: imagensExistentes, error: imagensError } = await supabase
      .from('imoveis_media')
      .select('caminho_arquivo');

    if (imagensExistentes && imagensExistentes.length > 0) {
      console.log(`🗑️ Deletando ${imagensExistentes.length} arquivos do storage...`);
      
      const caminhosParaDeletar = imagensExistentes.map(img => img.caminho_arquivo).filter(Boolean);
      if (caminhosParaDeletar.length > 0) {
        const { error: storageDeleteError } = await supabase.storage
          .from('imoveis-images')
          .remove(caminhosParaDeletar);
        
        if (storageDeleteError) {
          console.error('Erro ao deletar arquivos do storage:', storageDeleteError);
        } else {
          console.log('✅ Arquivos deletados do storage');
        }
      }
    }

    // Deletar metadados da tabela
    const { error: deleteError } = await supabase
      .from('imoveis_media')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('Erro ao limpar metadados:', deleteError);
      return NextResponse.json({ error: 'Erro ao limpar metadados' }, { status: 500 });
    }

    console.log('✅ Limpeza concluída');

    let totalImagensProcessadas = 0;
    const detalhesImagensGeradas = [];

    // 3. Para cada imóvel, gerar imagens únicas
    for (const imovel of imoveis) {
      const tipoImovel = imovel.tipo_imovel || 'apartamento';
      console.log(`🏠 Processando imóvel: ${imovel.titulo} (${tipoImovel})`);
      
      // Quantidade aleatória entre 3 e 12
      const quantidadeImagens = Math.floor(Math.random() * 10) + 3;
      console.log(`🎲 Quantidade desejada: ${quantidadeImagens}`);

      // Gerar imagens únicas para este imóvel
      const imagensUnicas = gerarImagensUnicasParaImovel(imovel.imovel_id, tipoImovel, quantidadeImagens);
      
      console.log(`🎯 Imagens únicas geradas: ${imagensUnicas.length}`);

      let imagensProcessadasComSucesso = 0;

      // Fazer upload de cada imagem
      for (let i = 0; i < imagensUnicas.length; i++) {
        const imagem = imagensUnicas[i];
        const fileName = `${imovel.imovel_id}_${i + 1}.jpg`;
        
        const mediaData = await downloadAndUploadImage(
          supabase,
          imovel.id,
          imagem.url,
          fileName,
          imagem.titulo,
          imagem.descricao,
          imagem.categoria,
          imagem.principal,
          imagem.ordem
        );

        if (mediaData) {
          totalImagensProcessadas++;
          imagensProcessadasComSucesso++;
        }
        
        // Pequena pausa entre downloads
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      detalhesImagensGeradas.push({
        imovel_id: imovel.imovel_id,
        titulo: imovel.titulo,
        tipo: imovel.tipo_imovel,
        imagens: imagensProcessadasComSucesso,
      });
    }

    console.log(`✅ Processo concluído! ${totalImagensProcessadas} imagens processadas`);

    // Estatísticas finais
    const estatisticas = {
      totalImoveis: imoveis.length,
      totalImagens: totalImagensProcessadas,
      mediaImagensPorImovel: Math.round((totalImagensProcessadas / imoveis.length) * 100) / 100,
      tiposProcessados: [...new Set(imoveis.map(i => i.tipo_imovel))],
    };

    console.log('📊 Estatísticas finais:', estatisticas);

    return NextResponse.json({
      success: true,
      message: `🎉 Geração de imagens ÚNICAS concluída!`,
      estatisticas,
      detalhes: detalhesImagensGeradas,
      resumo: {
        imoveisProcessados: imoveis.length,
        imagensGeradas: totalImagensProcessadas,
        mediaPorImovel: estatisticas.mediaImagensPorImovel
      }
    });

  } catch (error) {
    console.error('❌ Erro na geração de imagens:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

