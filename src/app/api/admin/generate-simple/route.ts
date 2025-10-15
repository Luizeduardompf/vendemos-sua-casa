import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { generateImovelId } from '@/lib/imovel-id';
import { createImovelSlug } from '@/lib/slug';

export async function POST() {
  try {
    const supabase = createClient();
    
    console.log('🧹 Iniciando geração simples de imóveis...');
    
    // Buscar apenas os primeiros 3 usuários para teste
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .limit(3);
    
    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError);
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
    
    const resultados = [];
    
    // Gerar 2 imóveis para cada usuário
    for (const user of users) {
      console.log(`🏠 Gerando imóveis para ${user.email}...`);
      
      const imoveisDoUsuario = [];
      
      for (let i = 0; i < 2; i++) {
        const imovelId = generateImovelId();
        const titulo = `Apartamento T${i + 1} - Teste ${i + 1}`;
        const slug = createImovelSlug(titulo, imovelId);
        
        const imovel = {
          proprietario_id: user.id,
          imovel_id: imovelId,
          titulo: titulo,
          descricao: `Descrição do apartamento T${i + 1} para ${user.email}`,
          slug: slug,
          tipo: 'apartamento',
          preco: 200000 + (i * 50000),
          area: 80 + (i * 20),
          quartos: i + 1,
          banheiros: 1,
          localizacao: 'Lisboa',
          status: 'publicado',
          visualizacoes: 0,
          favoritos: 0
        };
        
        console.log(`📝 Inserindo imóvel: ${titulo} (${imovelId})`);
        
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
        
        console.log(`✅ Imóvel inserido: ${imovelInserido.id}`);
        
        imoveisDoUsuario.push({
          id: imovelInserido.id,
          imovel_id: imovelId,
          titulo: titulo,
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
