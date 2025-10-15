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

    // Inserir imóveis de exemplo
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .insert([
        {
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
        },
        {
          proprietario_id: proprietarioId,
          titulo: 'Casa T3 com Jardim',
          descricao: 'Casa espaçosa com jardim privado',
          slug: 'casa-t3-jardim-1',
          tipo_imovel: 'casa',
          categoria: 'venda',
          preco_venda: 350000,
          morada: 'Rua da Paz, 456',
          codigo_postal: '1000-002',
          localidade: 'Lisboa',
          distrito: 'Lisboa',
          freguesia: 'Campo de Ourique',
          area_total: 120,
          area_util: 100,
          quartos: 3,
          casas_banho: 2,
          status: 'publicado',
          visibilidade: 'publico'
        }
      ])
      .select();

    if (imoveisError) {
      console.error('Erro ao inserir imóveis:', imoveisError);
      return NextResponse.json(
        { error: 'Erro ao inserir imóveis' },
        { status: 500 }
      );
    }

    // Inserir mídias para os imóveis
    const mediaInserts = imoveis.map(imovel => ({
      imovel_id: imovel.id,
      url_publica: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      tipo_media: 'foto',
      descricao: 'Foto principal do imóvel',
      ordem: 1,
      principal: true
    }));

    const { error: mediaError } = await supabase
      .from('imoveis_media')
      .insert(mediaInserts);

    if (mediaError) {
      console.error('Erro ao inserir mídias:', mediaError);
      return NextResponse.json(
        { error: 'Erro ao inserir mídias' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Dados de exemplo inseridos com sucesso',
      imoveis: imoveis.length
    });

  } catch (error) {
    console.error('Erro ao inserir dados de exemplo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
