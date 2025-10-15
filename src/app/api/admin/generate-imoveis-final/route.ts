import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { generateImovelId } from '@/lib/imovel-id';
import { createImovelSlug } from '@/lib/slug';

export async function POST() {
  try {
    const supabase = createClient();
    
    console.log('🧹 Iniciando geração de imóveis...');
    
    // 1. Buscar todos os usuários existentes
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .order('created_at', { ascending: true });
    
    if (usersError) {
      return NextResponse.json(
        { error: 'Erro ao buscar usuários', details: usersError },
        { status: 500 }
      );
    }
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum usuário encontrado' },
        { status: 404 }
      );
    }
    
    console.log(`👥 Encontrados ${users.length} usuários`);
    
    // 2. Dados de imóveis realistas
    const tiposImoveis = [
      {
        tipo: 'apartamento',
        variacoes: [
          { titulo: 'Apartamento T1 Renovado - Príncipe Real', descricao: 'Apartamento T1 completamente renovado no coração do Príncipe Real, com acabamentos de luxo e vista deslumbrante.' },
          { titulo: 'Apartamento T2 com Varanda - Centro Histórico', descricao: 'Apartamento T2 com varanda privativa no centro histórico, próximo a todos os serviços.' },
          { titulo: 'Apartamento T3 Moderno - Avenidas Novas', descricao: 'Apartamento T3 moderno nas Avenidas Novas, com design contemporâneo e excelente localização.' },
          { titulo: 'Apartamento T4 de Luxo - Lapa', descricao: 'Apartamento T4 de luxo na Lapa, com acabamentos premium e vista panorâmica.' },
          { titulo: 'Apartamento T2 com Terraço - Chiado', descricao: 'Apartamento T2 com terraço privativo no Chiado, zona nobre de Lisboa.' },
          { titulo: 'Apartamento T3 Premium - Estrela', descricao: 'Apartamento T3 premium na Estrela, com características únicas e localização privilegiada.' }
        ]
      },
      {
        tipo: 'casa',
        variacoes: [
          { titulo: 'Casa T3 com Jardim - Cascais', descricao: 'Casa T3 com jardim privativo em Cascais, ideal para famílias.' },
          { titulo: 'Casa T4 Moderna - Sintra', descricao: 'Casa T4 moderna em Sintra, com design contemporâneo e espaços generosos.' },
          { titulo: 'Moradia T5 de Luxo - Oeiras', descricao: 'Moradia T5 de luxo em Oeiras, com piscina e jardim amplo.' }
        ]
      },
      {
        tipo: 'terreno',
        variacoes: [
          { titulo: 'Terreno para Construção - Mafra', descricao: 'Terreno para construção em Mafra, com excelente localização e potencial.' },
          { titulo: 'Terreno Rural - Torres Vedras', descricao: 'Terreno rural em Torres Vedras, ideal para agricultura ou construção.' }
        ]
      }
    ];
    
    const resultados = [];
    
    // 3. Gerar imóveis para cada usuário
    for (const user of users) {
      console.log(`🏠 Gerando imóveis para ${user.email}...`);
      
      const imoveisDoUsuario = [];
      
      // Gerar 6 imóveis por usuário
      for (let i = 0; i < 6; i++) {
        const tipoImovel = tiposImoveis[i % tiposImoveis.length];
        const variacao = tipoImovel.variacoes[i % tipoImovel.variacoes.length];
        
        const imovelId = generateImovelId();
        const slug = createImovelSlug(variacao.titulo, imovelId);
        
        const imovel = {
          proprietario_id: user.id,
          imovel_id: imovelId,
          titulo: variacao.titulo,
          descricao: variacao.descricao,
          slug: slug,
          tipo: tipoImovel.tipo,
          preco: Math.floor(Math.random() * 500000) + 150000, // 150k a 650k
          area: Math.floor(Math.random() * 200) + 50, // 50 a 250 m²
          quartos: Math.floor(Math.random() * 4) + 1, // 1 a 5 quartos
          banheiros: Math.floor(Math.random() * 3) + 1, // 1 a 4 banheiros
          localizacao: ['Lisboa', 'Porto', 'Cascais', 'Sintra', 'Oeiras'][Math.floor(Math.random() * 5)],
          status: 'ativo',
          visualizacoes: Math.floor(Math.random() * 1000),
          favoritos: Math.floor(Math.random() * 100)
        };
        
        // Inserir imóvel
        const { data: imovelInserido, error: imovelError } = await supabase
          .from('imoveis')
          .insert(imovel)
          .select()
          .single();
        
        if (imovelError) {
          console.error(`❌ Erro ao inserir imóvel para ${user.email}:`, imovelError);
          continue;
        }
        
        // Inserir mídia (fotos)
        const fotos = [
          `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=${imovelId}-1`,
          `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=${imovelId}-2`,
          `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=${imovelId}-3`
        ];
        
        for (let j = 0; j < fotos.length; j++) {
          await supabase
            .from('imoveis_media')
            .insert({
              imovel_id: imovelInserido.id,
              url_publica: fotos[j],
              principal: j === 0,
              ordem: j + 1,
              nome_arquivo: `foto-${j + 1}.jpg`,
              caminho_arquivo: `/imoveis/${imovelInserido.id}/foto-${j + 1}.jpg`
            });
        }
        
        imoveisDoUsuario.push({
          id: imovelInserido.id,
          imovel_id: imovelId,
          titulo: variacao.titulo,
          slug: slug
        });
      }
      
      resultados.push({
        usuario: {
          id: user.id,
          email: user.email
        },
        imoveis: imoveisDoUsuario,
        total: imoveisDoUsuario.length
      });
      
      console.log(`✅ ${user.email}: ${imoveisDoUsuario.length} imóveis criados`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Imóveis gerados com sucesso!',
      total_usuarios: users.length,
      total_imoveis: resultados.reduce((acc, r) => acc + r.total, 0),
      resultados: resultados
    });
    
  } catch (error) {
    console.error('❌ Erro ao gerar imóveis:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}
