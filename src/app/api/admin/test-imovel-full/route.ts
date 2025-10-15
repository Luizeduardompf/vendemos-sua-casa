import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Buscar um imóvel específico com todas as informações
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select(`
        *,
        imoveis_media!left(
          id,
          url_publica,
          principal,
          ordem,
          descricao
        ),
        imoveis_amenities!left(
          id,
          nome,
          descricao,
          categoria
        )
      `)
      .eq('imovel_id', 'MXP-128')
      .single();
    
    if (imovelError) {
      return NextResponse.json({ error: imovelError.message }, { status: 500 });
    }
    
    console.log('🔍 Imóvel completo encontrado:', imovel);
    console.log('🔍 Mídia encontrada:', imovel.imoveis_media);
    
    // Buscar dados do proprietário
    const { data: proprietario, error: proprietarioError } = await supabase
      .from('users')
      .select('*')
      .eq('id', imovel.proprietario_id)
      .single();
    
    console.log('🔍 Proprietário encontrado:', proprietario);
    
    // Formatar as imagens como na API principal
    const imagens = imovel.imoveis_media?.map((media: any, index: number) => ({
      id: media.id,
      url: media.url_publica,
      isMain: media.principal || index === 0,
      alt: media.descricao || `Imagem ${index + 1} do ${imovel.titulo}`
    })) || [];
    
    // Formatar amenities
    const amenities = imovel.imoveis_amenities?.map((amenity: any) => ({
      id: amenity.id,
      nome: amenity.nome,
      descricao: amenity.descricao,
      categoria: amenity.categoria
    })) || [];
    
    // Formatar dados do proprietário
    const proprietarioFormatado = {
      nome: proprietario?.nome_exibicao || proprietario?.nome_completo || 'Proprietário',
      telefone: proprietario?.telefone || '+351 123 456 789',
      email: proprietario?.email,
      foto: proprietario?.foto_perfil || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      tipo: proprietario?.user_type
    };
    
    const imovelFormatado = {
      id: imovel.id,
      imovel_id: imovel.imovel_id,
      titulo: imovel.titulo,
      descricao: imovel.descricao,
      preco: imovel.preco,
      area: imovel.area,
      quartos: imovel.quartos,
      banheiros: imovel.banheiros,
      localizacao: `${imovel.morada}, ${imovel.localidade}`,
      status: imovel.status,
      dataCadastro: imovel.created_at,
      visualizacoes: imovel.visualizacoes || 0,
      favoritos: imovel.favoritos || 0,
      imagens,
      amenities,
      proprietario: proprietarioFormatado
    };
    
    console.log('🔍 Imóvel formatado:', imovelFormatado);
    console.log('🔍 Total de imagens:', imagens.length);
    
    return NextResponse.json({
      imovel: imovelFormatado,
      debug: {
        imagensRaw: imovel.imoveis_media,
        proprietarioRaw: proprietario,
        proprietarioError: proprietarioError
      }
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
