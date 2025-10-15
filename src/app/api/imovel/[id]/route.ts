import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { extractIdFromSlug } from '@/lib/slug';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    
    // Aguardar params e extrair ID do parâmetro (pode ser ID direto ou slug)
    const resolvedParams = await params;
    let imovelId = resolvedParams.id;
    const extractedId = extractIdFromSlug(resolvedParams.id);
    if (extractedId) {
      imovelId = extractedId;
    }

    // Tentar obter a sessão atual primeiro
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔵 API Imóvel - Session:', session ? 'Encontrada' : 'Não encontrada');
    
    let authUser = null;
    
    if (session?.user) {
      // Usar sessão atual se disponível
      authUser = session.user;
      console.log('🔵 API Imóvel - Usando sessão atual');
    } else {
      // Tentar obter token do header Authorization
      const authHeader = request.headers.get('authorization');
      console.log('🔵 API Imóvel - Auth Header:', authHeader ? 'Presente' : 'Ausente');
      
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        console.log('🔵 API Imóvel - Token extraído:', token ? 'Sim' : 'Não');
        
        const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token);
        console.log('🔵 API Imóvel - User do token:', tokenUser ? 'Encontrado' : 'Não encontrado');
        console.log('🔵 API Imóvel - Token Error:', tokenError);
        
        if (tokenUser && !tokenError) {
          authUser = tokenUser;
          console.log('🔵 API Imóvel - Usando token do header');
        }
      }
    }
    
    if (!authUser) {
      console.log('🔵 API Imóvel - Nenhum usuário autenticado encontrado');
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Buscar dados do usuário
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .single();

    if (userDataError || !userData) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Determinar se é um ID novo (ABC-123) ou UUID antigo
    const isNewIdFormat = /^[A-Z]{3}-[0-9]{3}$/.test(imovelId);
    console.log('🔵 API Imóvel - ID recebido:', imovelId);
    console.log('🔵 API Imóvel - É formato novo?', isNewIdFormat);
    
    // Buscar imóvel específico
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
      .eq(isNewIdFormat ? 'imovel_id' : 'id', imovelId)
      .eq('proprietario_id', userData.id) // Garantir que é do proprietário
      .single();

    if (imovelError || !imovel) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado ou você não tem permissão para visualizá-lo' },
        { status: 404 }
      );
    }

    // Transformar dados para o formato esperado pelo frontend
    const imovelFormatted = {
      id: imovel.id,
      titulo: imovel.titulo,
      tipo: imovel.tipo_imovel,
      preco: imovel.preco_venda || imovel.preco_arrendamento || 0,
      area: imovel.area_util || imovel.area_total || 0,
      area_terreno: imovel.area_terreno || 0,
      quartos: imovel.quartos || 0,
      banheiros: imovel.casas_banho || 0,
      wc: imovel.wc || 0,
      localizacao: `${imovel.localidade}, ${imovel.distrito}`,
      endereco: imovel.morada,
      codigo_postal: imovel.codigo_postal,
      cidade: imovel.localidade,
      distrito: imovel.distrito,
      pais: 'Portugal',
      estado: imovel.estado_conservacao || 'excelente',
      ano_construcao: imovel.ano_construcao,
      certificado_energetico: imovel.certificado_energetico,
      orientacao: imovel.orientacao,
      descricao: imovel.descricao || '',
      observacoes: imovel.condicoes_pagamento || '',
      status: imovel.status === 'publicado' ? 'ativo' : imovel.status,
      dataCadastro: imovel.created_at,
      visualizacoes: imovel.visualizacoes || 0,
      favoritos: imovel.favoritos || 0,
      tipo_negocio: imovel.categoria,
      disponibilidade: imovel.status === 'publicado' ? 'imediata' : 'sob_consulta',
      comissao: 3, // Valor padrão
      contacto_visitas: userData.telefone || '+351 123 456 789',
      palavras_chave: imovel.titulo.toLowerCase(),
      destaque: imovel.destaque || false,
      urgente: false,
      
      // Características baseadas nos amenities
      garagem: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('garagem')) || false,
      elevador: imovel.elevador || false,
      varanda: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('varanda')) || false,
      terraco: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('terraço')) || false,
      jardim: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('jardim')) || false,
      piscina: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('piscina')) || false,
      ar_condicionado: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('ar condicionado')) || false,
      aquecimento: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('aquecimento')) || false,
      lareira: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('lareira')) || false,
      alarme: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('alarme')) || false,
      portao_automatico: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('portão')) || false,
      internet: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('internet')) || false,
      tv_cabo: imovel.imoveis_amenities?.some((a: { nome: string }) => a.nome.toLowerCase().includes('tv')) || false,
      
      // Detalhes da garagem
      lugares_garagem: imovel.imoveis_amenities?.find((a: { nome: string; descricao?: string }) => a.nome.toLowerCase().includes('garagem'))?.descricao?.match(/\d+/)?.[0] || 0,
      tipo_garagem: 'coberta',
      
      // Imagens
      imagens: imovel.imoveis_media?.map((media: { id: string; url_publica?: string; principal?: boolean; descricao?: string }, index: number) => ({
        id: media.id,
        url: media.url_publica || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        isMain: media.principal || index === 0,
        alt: media.descricao || `Imagem ${index + 1} do imóvel`
      })) || [{
        id: '1',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        isMain: true,
        alt: 'Imagem principal do imóvel'
      }],
      
      // Informações do proprietário
      proprietario: {
        nome: userData.nome_exibicao || userData.nome_completo || 'Proprietário',
        telefone: userData.telefone || '+351 123 456 789',
        email: userData.email,
        foto: userData.foto_perfil || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        tipo: userData.user_type
      }
    };

    return NextResponse.json({ imovel: imovelFormatted });

  } catch (error) {
    console.error('Erro na API de imóvel:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
