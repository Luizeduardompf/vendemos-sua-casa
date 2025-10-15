import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { generateImovelId } from '@/lib/imovel-id';
import { createImovelSlug } from '@/lib/slug';

export async function POST() {
  try {
    const supabase = createClient();
    
    console.log('🏠 Iniciando geração final de imóveis...');
    
    // Buscar todos os usuários
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .order('created_at', { ascending: true });
    
    if (usersError || !users || users.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum usuário encontrado', details: usersError },
        { status: 404 }
      );
    }
    
    console.log(`👥 Encontrados ${users.length} usuários`);
    
    const resultados = [];
    
    // Gerar 6 imóveis para cada usuário
    for (const user of users) {
      console.log(`🏠 Gerando imóveis para ${user.email}...`);
      
      const imoveisDoUsuario = [];
      
      const tiposImoveis = [
        { titulo: 'Apartamento T1 Renovado - Príncipe Real', descricao: 'Apartamento T1 completamente renovado no coração do Príncipe Real, com acabamentos de luxo e vista deslumbrante.' },
        { titulo: 'Apartamento T2 com Varanda - Centro Histórico', descricao: 'Apartamento T2 com varanda privativa no centro histórico, próximo a todos os serviços.' },
        { titulo: 'Apartamento T3 Moderno - Avenidas Novas', descricao: 'Apartamento T3 moderno nas Avenidas Novas, com design contemporâneo e excelente localização.' },
        { titulo: 'Apartamento T4 de Luxo - Lapa', descricao: 'Apartamento T4 de luxo na Lapa, com acabamentos premium e vista panorâmica.' },
        { titulo: 'Apartamento T2 com Terraço - Chiado', descricao: 'Apartamento T2 com terraço privativo no Chiado, zona nobre de Lisboa.' },
        { titulo: 'Apartamento T3 Premium - Estrela', descricao: 'Apartamento T3 premium na Estrela, com características únicas e localização privilegiada.' }
      ];
      
      for (let i = 0; i < 6; i++) {
        const imovelId = generateImovelId();
        const tipoImovel = tiposImoveis[i];
        const slug = createImovelSlug(tipoImovel.titulo, imovelId);
        
        const imovel = {
          proprietario_id: user.id,
          imovel_id: imovelId,
          titulo: tipoImovel.titulo,
          descricao: tipoImovel.descricao,
          slug: slug,
          tipo_imovel: 'apartamento',
          categoria: 'venda',
          preco_venda: 200000 + (i * 50000), // 200k a 450k
          morada: `Rua ${['Liberdade', 'Augusta', 'Garrett', 'Chiado', 'Príncipe Real', 'Estrela'][i]}, ${100 + i * 10}, Lisboa`,
          localidade: 'Lisboa',
          distrito: 'Lisboa',
          area_util: 60 + (i * 15), // 60 a 135 m²
          quartos: Math.min(i + 1, 4), // 1 a 4 quartos
          casas_banho: Math.max(1, Math.floor(i / 2) + 1), // 1 a 3 banheiros
          andar: Math.floor(Math.random() * 5) + 1, // 1 a 5 andar
          elevador: i > 2, // Apartamentos maiores têm elevador
          ano_construcao: 1990 + Math.floor(Math.random() * 30), // 1990 a 2020
          estado_conservacao: ['excelente', 'bom', 'muito_bom'][Math.floor(Math.random() * 3)],
          orientacao: ['norte', 'sul', 'este', 'oeste'][Math.floor(Math.random() * 4)],
          visualizacoes: Math.floor(Math.random() * 500),
          favoritos: Math.floor(Math.random() * 50)
        };
        
        console.log(`📝 Inserindo: ${tipoImovel.titulo} (${imovelId})`);
        
        // Inserir imóvel
        const { data: imovelInserido, error: imovelError } = await supabase
          .from('imoveis')
          .insert(imovel)
          .select()
          .single();
        
        if (imovelError) {
          console.error(`❌ Erro ao inserir imóvel:`, imovelError);
          continue;
        }
        
        // As imagens serão inseridas pela API de imagens realistas
        // Removido o código de inserção de imagens básicas
        
        imoveisDoUsuario.push({
          id: imovelInserido.id,
          imovel_id: imovelId,
          titulo: tipoImovel.titulo,
          slug: slug
        });
        
        console.log(`✅ Inserido: ${imovelInserido.id}`);
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
