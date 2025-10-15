import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Tentar obter a sessão atual primeiro
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔵 API Imóveis - Session:', session ? 'Encontrada' : 'Não encontrada');
    console.log('🔵 API Imóveis - Session Error:', sessionError);
    
    let authUser = null;
    
    if (session?.user) {
      // Usar sessão atual se disponível
      authUser = session.user;
      console.log('🔵 API Imóveis - Usando sessão atual');
    } else {
      // Tentar obter token do header Authorization
      const authHeader = request.headers.get('authorization');
      console.log('🔵 API Imóveis - Auth Header:', authHeader ? 'Presente' : 'Ausente');
      
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        console.log('🔵 API Imóveis - Token extraído:', token ? 'Sim' : 'Não');
        
        const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token);
        console.log('🔵 API Imóveis - User do token:', tokenUser ? 'Encontrado' : 'Não encontrado');
        console.log('🔵 API Imóveis - Token Error:', tokenError);
        
        if (tokenUser && !tokenError) {
          authUser = tokenUser;
          console.log('🔵 API Imóveis - Usando token do header');
        }
      }
    }
    
    if (!authUser) {
      console.log('🔵 API Imóveis - Nenhum usuário autenticado encontrado');
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Buscar dados do usuário
    console.log('🔵 API Imóveis - Buscando usuário com ID:', authUser.id);
    let { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    console.log('🔵 API Imóveis - UserData encontrado:', !!userData);
    console.log('🔵 API Imóveis - UserData Error:', userDataError?.message);

    if (userDataError || !userData) {
      console.log('🔵 API Imóveis - Usuário não encontrado, tentando por email...');
      
      // Tentar buscar por email como fallback
      const { data: userDataByEmail, error: userDataByEmailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', authUser.email)
        .single();
      
      console.log('🔵 API Imóveis - UserData por email:', !!userDataByEmail);
      console.log('🔵 API Imóveis - UserData por email Error:', userDataByEmailError?.message);
      
      if (userDataByEmailError || !userDataByEmail) {
        return NextResponse.json(
          { error: 'Usuário não encontrado', details: userDataError?.message },
          { status: 404 }
        );
      }
      
      // Usar dados encontrados por email
      userData = userDataByEmail;
    }

    // Buscar imóveis do proprietário
    console.log('🔵 API Imóveis - UserData ID:', userData.id);
    console.log('🔵 API Imóveis - UserData Email:', userData.email);
    const { data: imoveis, error: imoveisError } = await supabase
      .from('imoveis')
      .select(`
        *,
        imoveis_media!left(
          id,
          url_publica,
          principal,
          ordem
        )
      `)
      .eq('proprietario_id', userData.id)
      .order('created_at', { ascending: false });
    
    console.log('🔵 API Imóveis - Imóveis encontrados:', imoveis?.length || 0);
    console.log('🔵 API Imóveis - Erro na consulta:', imoveisError);
    console.log('🔵 API Imóveis - Primeiros 2 imóveis:', imoveis?.slice(0, 2).map(i => ({ id: i.id, titulo: i.titulo, proprietario_id: i.proprietario_id })));

    if (imoveisError) {
      console.error('Erro ao buscar imóveis:', imoveisError);
      return NextResponse.json(
        { error: 'Erro ao buscar imóveis' },
        { status: 500 }
      );
    }

    // Transformar dados para o formato esperado pelo frontend
    const imoveisFormatted = imoveis.map(imovel => ({
      id: imovel.id,
      imovel_id: imovel.imovel_id,
      titulo: imovel.titulo,
      tipo: imovel.tipo_imovel,
      preco: imovel.preco_venda || imovel.preco_arrendamento || 0,
      area: imovel.area_util || imovel.area_total || 0,
      quartos: imovel.quartos || 0,
      banheiros: imovel.casas_banho || 0,
      localizacao: `${imovel.localidade}, ${imovel.distrito}`,
        status: imovel.status === 'publicado' ? 'publicado' :
                imovel.status === 'pendente' ? 'pendente' :
                imovel.status === 'inativo' ? 'inativo' :
                imovel.status === 'finalizado' ? 'finalizado' : 'pendente',
      dataCadastro: imovel.created_at,
      visualizacoes: imovel.visualizacoes || 0,
      favoritos: imovel.favoritos || 0,
      imagemPrincipal: imovel.imoveis_media?.find((media: { principal: boolean; url_publica: string }) => media.principal)?.url_publica || 
                      imovel.imoveis_media?.[0]?.url_publica || 
                      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      imagem: imovel.imoveis_media?.find((media: { principal: boolean; url_publica: string }) => media.principal)?.url_publica || 
              imovel.imoveis_media?.[0]?.url_publica || 
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      descricao: imovel.descricao || '',
      slug: imovel.slug,
      imovel_id: imovel.imovel_id
    }));

    return NextResponse.json({ imoveis: imoveisFormatted });

  } catch (error) {
    console.error('Erro na API de imóveis:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
