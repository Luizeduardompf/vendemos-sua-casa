import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { generateImovelId } from '@/lib/imovel-id';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Limpar dados existentes
    await supabase.from('imoveis_media').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('imoveis_amenities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('imoveis').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Buscar usuários proprietários
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .eq('user_type', 'proprietario');

    if (usersError || !users || users.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum usuário proprietário encontrado' },
        { status: 404 }
      );
    }

    const imoveisData = [];
    const mediaData = [];
    const amenitiesData = [];

    // Dados realistas de apartamentos
    const apartamentosData = [
      {
        titulo: 'Apartamento T2 com Varanda - Centro Histórico',
        descricao: 'Apartamento completamente renovado no coração do centro histórico de Lisboa. Com 2 quartos, sala ampla e varanda com vista para o rio Tejo. Excelente localização com transportes públicos à porta.',
        preco: 280000,
        morada: 'Rua da Alfândega, 45',
        codigo_postal: '1100-001',
        freguesia: 'Alfama',
        area_total: 75,
        area_util: 70,
        quartos: 2,
        casas_banho: 1,
        andar: 3,
        total_andares: 4,
        elevador: true,
        ano_construcao: 2015,
        estado_conservacao: 'excelente',
        certificado_energetico: 'B',
        orientacao: 'sul',
        exposicao_solar: 'manha',
        destaque: false,
        premium: false
      },
      {
        titulo: 'Apartamento T3 Moderno - Avenidas Novas',
        descricao: 'Apartamento moderno nas Avenidas Novas com 3 quartos e acabamentos de qualidade. Próximo do metro e com todas as comodidades. Ideal para família.',
        preco: 450000,
        morada: 'Avenida de Roma, 123',
        codigo_postal: '1000-001',
        freguesia: 'Avenidas Novas',
        area_total: 95,
        area_util: 90,
        quartos: 3,
        casas_banho: 2,
        andar: 2,
        total_andares: 6,
        elevador: true,
        ano_construcao: 2020,
        estado_conservacao: 'muito_bom',
        certificado_energetico: 'A',
        orientacao: 'norte',
        exposicao_solar: 'tarde',
        destaque: false,
        premium: false
      },
      {
        titulo: 'Apartamento T1 Renovado - Príncipe Real',
        descricao: 'Apartamento T1 totalmente renovado no Príncipe Real. Com design contemporâneo e acabamentos de luxo. Localização privilegiada no centro da cidade.',
        preco: 320000,
        morada: 'Rua da Escola Politécnica, 78',
        codigo_postal: '1200-001',
        freguesia: 'Príncipe Real',
        area_total: 55,
        area_util: 50,
        quartos: 1,
        casas_banho: 1,
        andar: 4,
        total_andares: 5,
        elevador: false,
        ano_construcao: 2018,
        estado_conservacao: 'excelente',
        certificado_energetico: 'B+',
        orientacao: 'oeste',
        exposicao_solar: 'manha',
        destaque: true,
        premium: false
      },
      {
        titulo: 'Apartamento T4 de Luxo - Lapa',
        descricao: 'Apartamento de luxo na Lapa com 4 quartos e vista panorâmica. Acabamentos premium e localização exclusiva. Ideal para quem procura conforto e elegância.',
        preco: 750000,
        morada: 'Rua de São Bento, 156',
        codigo_postal: '1200-001',
        freguesia: 'Lapa',
        area_total: 140,
        area_util: 130,
        quartos: 4,
        casas_banho: 3,
        wc: 1,
        andar: 1,
        total_andares: 8,
        elevador: true,
        ano_construcao: 2022,
        estado_conservacao: 'excelente',
        certificado_energetico: 'A+',
        orientacao: 'sul',
        exposicao_solar: 'manha',
        destaque: true,
        premium: true
      },
      {
        titulo: 'Apartamento T2 com Terraço - Chiado',
        descricao: 'Apartamento T2 com terraço privado no Chiado. Com vista para o rio e acabamentos modernos. Localização central com fácil acesso a transportes.',
        preco: 380000,
        morada: 'Rua Garrett, 89',
        codigo_postal: '1200-001',
        freguesia: 'Chiado',
        area_total: 80,
        area_util: 75,
        quartos: 2,
        casas_banho: 2,
        andar: 2,
        total_andares: 4,
        elevador: true,
        ano_construcao: 2019,
        estado_conservacao: 'muito_bom',
        certificado_energetico: 'B',
        orientacao: 'este',
        exposicao_solar: 'tarde',
        destaque: false,
        premium: false
      },
      {
        titulo: 'Apartamento T3 Premium - Estrela',
        descricao: 'Apartamento premium na Estrela com 3 quartos e acabamentos de luxo. Vista para o jardim e localização privilegiada.',
        preco: 520000,
        morada: 'Rua da Estrela, 234',
        codigo_postal: '1200-001',
        freguesia: 'Estrela',
        area_total: 110,
        area_util: 105,
        quartos: 3,
        casas_banho: 2,
        andar: 2,
        total_andares: 6,
        elevador: true,
        ano_construcao: 2021,
        estado_conservacao: 'excelente',
        certificado_energetico: 'A',
        orientacao: 'norte',
        exposicao_solar: 'manha',
        destaque: false,
        premium: false
      }
    ];

    // Gerar imóveis para cada usuário
    for (const user of users) {
      for (let i = 0; i < 6; i++) {
        const apartamento = apartamentosData[i];
        const imovelId = generateImovelId();
        const slug = `${apartamento.titulo.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-${imovelId}`;
        
        const imovel = {
          proprietario_id: user.id,
          titulo: apartamento.titulo,
          descricao: apartamento.descricao,
          slug: slug,
          tipo_imovel: 'apartamento',
          categoria: 'venda',
          preco_venda: apartamento.preco,
          morada: apartamento.morada,
          codigo_postal: apartamento.codigo_postal,
          localidade: 'Lisboa',
          distrito: 'Lisboa',
          freguesia: apartamento.freguesia,
          area_total: apartamento.area_total,
          area_util: apartamento.area_util,
          quartos: apartamento.quartos,
          casas_banho: apartamento.casas_banho,
          wc: apartamento.wc || 0,
          andar: apartamento.andar,
          total_andares: apartamento.total_andares,
          elevador: apartamento.elevador,
          ano_construcao: apartamento.ano_construcao,
        estado_conservacao: 'excelente',
        certificado_energetico: 'B',
        orientacao: 'sul',
          status: 'publicado',
          visibilidade: 'publico',
          destaque: apartamento.destaque,
          premium: apartamento.premium,
          visualizacoes: Math.floor(Math.random() * 1000) + 50,
          favoritos: Math.floor(Math.random() * 50) + 5,
          contactos: Math.floor(Math.random() * 20) + 2
        };
        
        imoveisData.push(imovel);
      }
    }

    // Inserir imóveis
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .insert(imoveisData)
      .select();

    if (imoveisError) {
      console.error('Erro ao inserir imóveis:', imoveisError);
      return NextResponse.json(
        { error: 'Erro ao inserir imóveis: ' + imoveisError.message },
        { status: 500 }
      );
    }

    // Imagens realistas por tipo de imóvel - URLs únicas do Unsplash
    const imagensPorTipo = {
      'Apartamento T2 com Varanda - Centro Histórico': [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80', // Exterior histórico
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80', // Sala moderna
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80', // Quarto
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80'  // Varanda
      ],
      'Apartamento T3 Moderno - Avenidas Novas': [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80', // Exterior moderno
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80', // Sala espaçosa
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80', // Quarto principal
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80'  // Cozinha moderna
      ],
      'Apartamento T1 Renovado - Príncipe Real': [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80', // Exterior elegante
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80', // Sala compacta
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80', // Quarto
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80'  // Banheiro
      ],
      'Apartamento T4 de Luxo - Lapa': [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80', // Exterior luxuoso
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80', // Sala de estar
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80', // Quarto master
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80'  // Cozinha gourmet
      ],
      'Apartamento T2 com Terraço - Chiado': [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80', // Exterior central
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80', // Sala com vista
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80', // Quarto
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80'  // Terraço
      ],
      'Apartamento T3 Premium - Estrela': [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80', // Exterior premium
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80', // Sala elegante
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80', // Quarto principal
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80'  // Jardim
      ]
    };

    for (const imovel of imoveis) {
      // Buscar imagens específicas para este tipo de imóvel
      const imagens = imagensPorTipo[imovel.titulo] || imagensPorTipo['Apartamento T2 com Varanda - Centro Histórico'];
      
      // Foto principal
      mediaData.push({
        imovel_id: imovel.id,
        url_publica: imagens[0],
        nome_arquivo: `foto-principal-${imovel.id}.jpg`,
        caminho_arquivo: `/uploads/imoveis/${imovel.id}/foto-principal.jpg`,
        tipo_media: 'foto',
        descricao: 'Foto principal do apartamento',
        ordem: 1,
        principal: true
      });

      // Fotos adicionais
      const descricoes = ['Sala de estar', 'Quarto principal', 'Cozinha', 'Varanda/Terraço'];
      for (let i = 1; i < imagens.length; i++) {
        mediaData.push({
          imovel_id: imovel.id,
          url_publica: imagens[i],
          nome_arquivo: `foto-${i}-${imovel.id}.jpg`,
          caminho_arquivo: `/uploads/imoveis/${imovel.id}/foto-${i}.jpg`,
          tipo_media: 'foto',
          descricao: descricoes[i - 1] || `Foto ${i}`,
          ordem: i + 1,
          principal: false
        });
      }

      // Comodidades (removido por enquanto devido a problemas de schema)
    }

    // Inserir mídias
    const { error: mediaError } = await supabase
      .from('imoveis_media')
      .insert(mediaData);

    if (mediaError) {
      console.error('Erro ao inserir mídias:', mediaError);
      return NextResponse.json(
        { error: 'Erro ao inserir mídias: ' + mediaError.message },
        { status: 500 }
      );
    }

    // Comodidades removidas por enquanto

    return NextResponse.json({ 
      success: true, 
      message: 'Imóveis realistas gerados com sucesso',
      imoveis: imoveis.length,
      midias: mediaData.length,
      comodidades: amenitiesData.length
    });

  } catch (error) {
    console.error('Erro ao gerar imóveis realistas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + error.message },
      { status: 500 }
    );
  }
}
