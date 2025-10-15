import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { generateImovelId } from '@/lib/imovel-id';
import { createImovelSlug } from '@/lib/slug';

export async function POST() {
  try {
    const supabase = createClient();
    
    console.log('🧪 Testando inserção mínima...');
    
    // Buscar primeiro usuário
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .limit(1);
    
    if (usersError || !users || users.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum usuário encontrado', details: usersError },
        { status: 404 }
      );
    }
    
    const user = users[0];
    console.log(`👤 Usuário: ${user.email} (${user.id})`);
    
    // Gerar dados mínimos
    const imovelId = generateImovelId();
    const titulo = 'Apartamento Teste';
    const slug = createImovelSlug(titulo, imovelId);
    
    console.log(`🏠 ID: ${imovelId}, Slug: ${slug}`);
    
    // Inserir apenas campos essenciais
    const imovelMinimo = {
      proprietario_id: user.id,
      imovel_id: imovelId,
      titulo: titulo,
      slug: slug,
      tipo_imovel: 'apartamento',
      categoria: 'venda',
      morada: 'Rua Teste, 123, Lisboa',
      localidade: 'Lisboa',
      distrito: 'Lisboa'
    };
    
    console.log('📝 Dados mínimos:', imovelMinimo);
    
    // Tentar inserir
    const { data: imovelInserido, error: imovelError } = await supabase
      .from('imoveis')
      .insert(imovelMinimo)
      .select()
      .single();
    
    if (imovelError) {
      console.error('❌ Erro ao inserir:', imovelError);
      return NextResponse.json(
        { error: 'Erro ao inserir imóvel', details: imovelError },
        { status: 500 }
      );
    }
    
    console.log('✅ Imóvel inserido:', imovelInserido);
    
    return NextResponse.json({
      success: true,
      message: 'Imóvel inserido com sucesso!',
      imovel: imovelInserido
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno', details: error.message },
      { status: 500 }
    );
  }
}
