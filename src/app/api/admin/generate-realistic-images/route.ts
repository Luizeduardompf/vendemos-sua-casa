import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Banco de imagens realistas por tipo de imóvel
const IMAGENS_POR_TIPO = {
  apartamento: {
    exterior: [
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&q=80',
        titulo: 'Fachada Principal',
        descricao: 'Fachada moderna do edifício com arquitetura contemporânea'
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80',
        titulo: 'Vista do Edifício',
        descricao: 'Vista panorâmica do edifício e arredores'
      }
    ],
    interior: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80',
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
      }
    ],
    varanda: [
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80',
        titulo: 'Varanda Principal',
        descricao: 'Varanda privada com vista para a cidade'
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
      },
      {
        url: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=800&h=600&fit=crop&q=80',
        titulo: 'Casa de Banho Principal',
        descricao: 'Casa de banho completa com banheira de hidromassagem'
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80',
        titulo: 'Escritório',
        descricao: 'Escritório privado com vista para o jardim'
      }
    ],
    garagem: [
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80',
        titulo: 'Garagem',
        descricao: 'Garagem para 2 carros com portão automático'
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
      },
      {
        url: 'https://images.unsplash.com/photo-1631889993952-431cc8e4d75e?w=800&h=600&fit=crop&q=80',
        titulo: 'Quarto Principal',
        descricao: 'Quarto principal com roupeiro embutido e varanda'
      }
    ]
  },
  
  loja: {
    exterior: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80',
        titulo: 'Fachada da Loja',
        descricao: 'Fachada comercial com vitrine e letreiro'
      },
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80',
        titulo: 'Entrada Principal',
        descricao: 'Entrada principal com fácil acesso para clientes'
      }
    ],
    interior: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80',
        titulo: 'Área de Vendas',
        descricao: 'Área de vendas ampla e bem iluminada'
      },
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80',
        titulo: 'Balcão de Atendimento',
        descricao: 'Balcão de atendimento moderno e funcional'
      },
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80',
        titulo: 'Área de Estoque',
        descricao: 'Área de estoque organizada e acessível'
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
      },
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80',
        titulo: 'Área de Trabalho',
        descricao: 'Área de trabalho aberta e bem iluminada'
      },
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80',
        titulo: 'Recepção',
        descricao: 'Recepção moderna e acolhedora'
      }
    ]
  }
};

// Função para obter imagens aleatórias de um tipo específico
function getImagensAleatorias(tipoImovel: string, quantidade: number = 6) {
  const imagensTipo = IMAGENS_POR_TIPO[tipoImovel as keyof typeof IMAGENS_POR_TIPO];
  
  if (!imagensTipo) {
    // Fallback para tipo não encontrado
    return [
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80',
        titulo: 'Imagem Principal',
        descricao: 'Imagem principal do imóvel',
        categoria: 'exterior'
      }
    ];
  }
  
  const todasImagens = [];
  
  // Adicionar imagens de cada categoria
  Object.entries(imagensTipo).forEach(([categoria, imagens]) => {
    imagens.forEach(imagem => {
      todasImagens.push({
        ...imagem,
        categoria
      });
    });
  });
  
  // Embaralhar e pegar a quantidade solicitada
  const imagensEmbaralhadas = todasImagens.sort(() => Math.random() - 0.5);
  return imagensEmbaralhadas.slice(0, Math.min(quantidade, 12));
}

export async function POST() {
  const supabase = createClient();
  
  try {
    // Buscar todos os imóveis existentes
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .select('id, imovel_id, titulo, tipo_imovel');
    
    if (imoveisError) {
      console.error('Erro ao buscar imóveis:', imoveisError);
      return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 });
    }
    
    if (!imoveis || imoveis.length === 0) {
      return NextResponse.json({ error: 'Nenhum imóvel encontrado' }, { status: 404 });
    }
    
    console.log(`🖼️ Encontrados ${imoveis.length} imóveis para atualizar imagens`);
    
    // Limpar imagens existentes
    await supabase
      .from('imoveis_media')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletar todos
    
    console.log('🗑️ Imagens antigas removidas');
    
    let totalImagensInseridas = 0;
    
    // Para cada imóvel, gerar imagens realistas
    for (const imovel of imoveis) {
      const tipoImovel = imovel.tipo_imovel || 'apartamento';
      const quantidadeImagens = Math.floor(Math.random() * 10) + 3; // 3-12 imagens
      
      const imagens = getImagensAleatorias(tipoImovel, quantidadeImagens);
      
      console.log(`🖼️ Gerando ${imagens.length} imagens para ${imovel.titulo} (${tipoImovel})`);
      
      // Inserir cada imagem
      for (let i = 0; i < imagens.length; i++) {
        const imagem = imagens[i];
        
        const { error: mediaError } = await supabase
          .from('imoveis_media')
          .insert({
            imovel_id: imovel.id,
            url_publica: imagem.url,
            principal: i === 0, // Primeira imagem é principal
            ordem: i + 1,
            descricao: imagem.descricao,
            nome_arquivo: `${imovel.imovel_id}_${i + 1}.jpg`,
            caminho_arquivo: `/imoveis/${imovel.imovel_id}/imagem_${i + 1}.jpg`,
            tipo_media: 'foto',
            categoria: imagem.categoria,
            ativo: true
          });
        
        if (mediaError) {
          console.error(`❌ Erro ao inserir imagem ${i + 1} do imóvel ${imovel.titulo}:`, mediaError);
        } else {
          totalImagensInseridas++;
        }
      }
    }
    
    console.log(`✅ Processo concluído! ${totalImagensInseridas} imagens inseridas`);
    
    return NextResponse.json({
      success: true,
      message: `Imagens realistas geradas com sucesso!`,
      totalImoveis: imoveis.length,
      totalImagens: totalImagensInseridas,
      detalhes: imoveis.map(imovel => ({
        imovel_id: imovel.imovel_id,
        titulo: imovel.titulo,
        tipo: imovel.tipo_imovel,
        imagens: getImagensAleatorias(imovel.tipo_imovel || 'apartamento', 6).length
      }))
    });
    
  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
