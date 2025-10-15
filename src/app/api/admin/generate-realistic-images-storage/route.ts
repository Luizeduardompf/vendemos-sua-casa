import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Função para gerar URLs únicas do Unsplash
function gerarUrlUnicaUnsplash(photoId: string, width: number = 800, height: number = 600, quality: number = 80) {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&q=${quality}&t=${Date.now()}`;
}

// Banco de imagens realistas por tipo de imóvel - VERSÃO STORAGE EXPANDIDA COM URLs ÚNICAS
const IMAGENS_POR_TIPO = {
  apartamento: {
    exterior: [
      {
        photoId: '1545324418-cc1a3fa10c00',
        titulo: 'Fachada Principal',
        descricao: 'Fachada moderna do edifício com arquitetura contemporânea'
      },
      {
        photoId: '1560448204-e02f11c3d0e2',
        titulo: 'Vista do Edifício',
        descricao: 'Vista panorâmica do edifício e arredores'
      },
      {
        photoId: '1570129477492-45c003edd2be',
        titulo: 'Entrada Principal',
        descricao: 'Entrada elegante com portaria e receção'
      },
      {
        photoId: '1583608205776-bfd35f0d9f83',
        titulo: 'Vista da Rua',
        descricao: 'Vista da rua mostrando a localização privilegiada'
      },
      {
        photoId: '1564013799919-ab600027ffc6',
        titulo: 'Edifício Moderno',
        descricao: 'Arquitetura contemporânea com design elegante'
      },
      {
        photoId: '1545324418-cc1a3fa10c00',
        titulo: 'Fachada Clássica',
        descricao: 'Fachada tradicional com elementos modernos'
      },
      {
        photoId: '1560448204-e02f11c3d0e2',
        titulo: 'Vista Panorâmica',
        descricao: 'Vista ampla do edifício e entorno'
      },
      {
        photoId: '1570129477492-45c003edd2be',
        titulo: 'Entrada Elegante',
        descricao: 'Entrada principal com design sofisticado'
      },
      {
        photoId: '1583608205776-bfd35f0d9f83',
        titulo: 'Localização Privilegiada',
        descricao: 'Vista da rua mostrando a excelente localização'
      },
      {
        photoId: '1564013799919-ab600027ffc6',
        titulo: 'Arquitetura Contemporânea',
        descricao: 'Design moderno e funcional'
      }
    ],
    interior: [
      {
        photoId: '1586023492125-27b2c045efd7',
        titulo: 'Sala de Estar',
        descricao: 'Sala espaçosa com muita luz natural e acabamentos modernos'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
        titulo: 'Cozinha Principal',
        descricao: 'Cozinha equipada com eletrodomésticos modernos e ilha central'
      },
      {
        url: 'https://images.unsplash.com/photo-1631889993952-431cc8e4d75e?w=800&h=600&fit=crop&q=80',
        titulo: 'Quarto Principal',
        descricao: 'Quarto amplo com roupeiro embutido e varanda privada'
      },
      {
        url: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=800&h=600&fit=crop&q=80',
        titulo: 'Casa de Banho',
        descricao: 'Casa de banho completa com banheira e chuveiro'
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80',
        titulo: 'Quarto Secundário',
        descricao: 'Quarto secundário com roupeiro embutido'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
        titulo: 'Hall de Entrada',
        descricao: 'Hall de entrada amplo e bem iluminado'
      }
    ],
    varanda: [
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80',
        titulo: 'Varanda Principal',
        descricao: 'Varanda privada com vista para a cidade'
      },
      {
        url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop&q=80',
        titulo: 'Terraço',
        descricao: 'Terraço amplo com área de lazer'
      }
    ]
  },
  
  casa: {
    exterior: [
      {
        url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop&q=80',
        titulo: 'Fachada da Casa',
        descricao: 'Casa unifamiliar com jardim frontal e garagem'
      },
      {
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80',
        titulo: 'Vista Lateral',
        descricao: 'Vista lateral da casa mostrando a arquitetura completa'
      },
      {
        url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop&q=80',
        titulo: 'Jardim Traseiro',
        descricao: 'Jardim privado com área de lazer e piscina'
      }
    ],
    interior: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80',
        titulo: 'Sala de Estar',
        descricao: 'Sala ampla com lareira e acesso ao jardim'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
        titulo: 'Cozinha Rústica',
        descricao: 'Cozinha espaçosa com ilha central e acesso ao terraço'
      },
      {
        url: 'https://images.unsplash.com/photo-1631889993952-431cc8e4d75e?w=800&h=600&fit=crop&q=80',
        titulo: 'Quarto Principal',
        descricao: 'Quarto principal com roupeiro embutido e vista para o jardim'
      }
    ]
  },
  
  terreno: {
    exterior: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&q=80',
        titulo: 'Vista Geral do Terreno',
        descricao: 'Terreno plano e amplo ideal para construção'
      },
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&q=80',
        titulo: 'Localização Estratégica',
        descricao: 'Terreno bem localizado com fácil acesso e infraestrutura'
      },
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&q=80',
        titulo: 'Vista Panorâmica',
        descricao: 'Vista panorâmica do terreno e arredores'
      }
    ]
  },
  
  moradia: {
    exterior: [
      {
        url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop&q=80',
        titulo: 'Fachada da Moradia',
        descricao: 'Moradia unifamiliar com arquitetura tradicional portuguesa'
      },
      {
        url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80',
        titulo: 'Vista Lateral',
        descricao: 'Vista lateral mostrando a estrutura completa da moradia'
      }
    ],
    interior: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80',
        titulo: 'Sala de Estar',
        descricao: 'Sala de estar ampla com lareira tradicional'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
        titulo: 'Cozinha Tradicional',
        descricao: 'Cozinha espaçosa com móveis rústicos e lareira'
      }
    ]
  },
  
  loja: {
    exterior: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80',
        titulo: 'Fachada da Loja',
        descricao: 'Fachada comercial com vitrine e letreiro'
      }
    ],
    interior: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80',
        titulo: 'Área de Vendas',
        descricao: 'Área de vendas ampla e bem iluminada'
      }
    ]
  },
  
  escritorio: {
    exterior: [
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80',
        titulo: 'Fachada do Escritório',
        descricao: 'Edifício comercial moderno com fachada de vidro'
      }
    ],
    interior: [
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80',
        titulo: 'Sala de Reuniões',
        descricao: 'Sala de reuniões equipada com tecnologia moderna'
      }
    ]
  }
};

// Função para baixar imagem e fazer upload para Supabase Storage - MELHORADA
async function downloadAndUploadImage(
  supabase: any,
  imovelId: string,
  imageUrl: string,
  fileName: string,
  titulo: string,
  descricao: string,
  categoria: string,
  isPrincipal: boolean,
  ordem: number
) {
  try {
    console.log(`📥 Baixando imagem: ${imageUrl}`);
    
    // Baixar imagem com timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageDownloader/1.0)'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Erro ao baixar imagem: ${response.status} ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    
    // Validar tamanho (máximo 3MB)
    if (imageBuffer.byteLength > 3 * 1024 * 1024) {
      console.warn(`⚠️ Imagem muito grande (${Math.round(imageBuffer.byteLength / 1024 / 1024)}MB), pulando...`);
      return null;
    }

    const filePath = `${imovelId}/${fileName}`;
    console.log(`📤 Fazendo upload para: ${filePath}`);

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imoveis-images')
      .upload(filePath, imageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      return null;
    }

    console.log(`✅ Upload concluído: ${filePath}`);

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('imoveis-images')
      .getPublicUrl(filePath);

    // Inserir metadados na tabela
    const { data: mediaData, error: mediaError } = await supabase
      .from('imoveis_media')
      .insert({
        imovel_id: imovelId,
        url_publica: urlData.publicUrl,
        principal: isPrincipal,
        ordem: ordem,
        descricao: descricao,
        nome_arquivo: fileName,
        caminho_arquivo: filePath,
        tipo_media: 'foto',
        categoria: categoria,
        ativo: true
      })
      .select()
      .single();

    if (mediaError) {
      console.error('❌ Erro ao inserir metadados:', mediaError);
      return null;
    }

    console.log(`✅ Metadados inseridos para: ${titulo}`);
    return mediaData;

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('⏰ Timeout ao baixar imagem:', imageUrl);
    } else {
      console.error('❌ Erro ao processar imagem:', error);
    }
    return null;
  }
}

export async function POST() {
  const supabase = createClient();
  
  try {
    console.log('🚀 Iniciando geração completa de imagens com Supabase Storage...');
    console.log('📋 Processo: Limpar → Baixar → Armazenar → Associar');

    // 1. Buscar todos os imóveis primeiro
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

    // 2. Limpar TODAS as imagens existentes (metadados + arquivos físicos)
    console.log('🗑️ Limpando imagens existentes...');
    
    // Buscar todas as imagens existentes para deletar do storage
    const { data: imagensExistentes, error: imagensError } = await supabase
      .from('imoveis_media')
      .select('caminho_arquivo');

    if (imagensError) {
      console.error('Erro ao buscar imagens existentes:', imagensError);
    } else if (imagensExistentes && imagensExistentes.length > 0) {
      console.log(`🗑️ Deletando ${imagensExistentes.length} arquivos do storage...`);
      
      // Deletar arquivos do storage
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
    // Removido o controle global de imagens usadas para permitir reutilização

    // 3. Para cada imóvel, gerar e fazer upload das imagens
    for (const imovel of imoveis) {
      const tipoImovel = imovel.tipo_imovel || 'apartamento';
      console.log(`🏠 Processando imóvel: ${imovel.titulo} (${tipoImovel})`);
      
      const imagensTipo = IMAGENS_POR_TIPO[tipoImovel as keyof typeof IMAGENS_POR_TIPO];
      
      if (!imagensTipo) {
        console.log(`⚠️ Tipo de imóvel não encontrado: ${tipoImovel}`);
        continue;
      }
      
      console.log(`📋 Imagens tipo encontradas para ${tipoImovel}:`, Object.keys(imagensTipo));

      // Lógica inteligente de seleção de imagens
      const todasImagens = [];
      Object.entries(imagensTipo).forEach(([categoria, imagens]) => {
        console.log(`📂 Processando categoria ${categoria}: ${imagens.length} imagens`);
        imagens.forEach(imagem => {
          todasImagens.push({ ...imagem, categoria });
        });
      });

      console.log(`📊 Total de imagens disponíveis: ${todasImagens.length}`);

      // Quantidade aleatória entre 3 e 12 para cada imóvel
      const quantidadeImagens = Math.floor(Math.random() * 10) + 3; // 3-12 imagens
      console.log(`🎲 Quantidade desejada: ${quantidadeImagens}`);

      // Seleção inteligente: sempre incluir exterior e interior
      const imagensSelecionadas = [];
      
      // 1. SEMPRE incluir pelo menos 1 imagem exterior
      const imagensExterior = todasImagens.filter(img => img.categoria === 'exterior');
      console.log(`🏢 Imagens exterior disponíveis: ${imagensExterior.length}`);
      
      if (imagensExterior.length > 0) {
        const imagemExterior = imagensExterior[Math.floor(Math.random() * imagensExterior.length)];
        imagensSelecionadas.push(imagemExterior);
        console.log(`✅ Selecionada imagem exterior: ${imagemExterior.titulo}`);
      }
      
      // 2. SEMPRE incluir pelo menos 1 imagem interior (se disponível)
      const imagensInterior = todasImagens.filter(img => img.categoria === 'interior');
      console.log(`🏠 Imagens interior disponíveis: ${imagensInterior.length}`);
      
      if (imagensInterior.length > 0) {
        const imagemInterior = imagensInterior[Math.floor(Math.random() * imagensInterior.length)];
        imagensSelecionadas.push(imagemInterior);
        console.log(`✅ Selecionada imagem interior: ${imagemInterior.titulo}`);
      }
      
      // 3. Preencher o resto com imagens aleatórias (garantindo que não há duplicatas)
      const imagensDisponiveis = todasImagens.filter(img => 
        !imagensSelecionadas.some(sel => sel.url === img.url)
      );
      
      console.log(`🔄 Imagens disponíveis para preenchimento: ${imagensDisponiveis.length}`);
      
      // Embaralhar e pegar o que precisar, mas limitar ao que está disponível
      const imagensEmbaralhadas = imagensDisponiveis.sort(() => Math.random() - 0.5);
      const quantidadeRestante = Math.max(0, quantidadeImagens - imagensSelecionadas.length);
      const imagensAdicionais = imagensEmbaralhadas.slice(0, Math.min(quantidadeRestante, imagensDisponiveis.length));
      
      imagensSelecionadas.push(...imagensAdicionais);
      
      console.log(`✅ Imagens finais selecionadas: ${imagensSelecionadas.length} (máximo disponível: ${todasImagens.length})`);

      console.log(`🎯 Total de imagens selecionadas: ${imagensSelecionadas.length}`);
      console.log(`🖼️ Processando ${imagensSelecionadas.length} imagens para ${imovel.titulo} (${tipoImovel})`);

      let imagensProcessadasComSucesso = 0;

      // Fazer upload de cada imagem
      for (let i = 0; i < imagensSelecionadas.length; i++) {
        const imagem = imagensSelecionadas[i];
        const fileName = `${imovel.imovel_id}_${i + 1}.jpg`;
        
        const mediaData = await downloadAndUploadImage(
          supabase,
          imovel.id,
          imagem.url,
          fileName,
          imagem.titulo,
          imagem.descricao,
          imagem.categoria,
          i === 0, // Primeira imagem é principal
          i + 1
        );

        if (mediaData) {
          totalImagensProcessadas++;
          imagensProcessadasComSucesso++;
        }
        
        // Pequena pausa entre downloads para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 150));
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
      message: `🎉 Geração completa de imagens concluída!`,
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
