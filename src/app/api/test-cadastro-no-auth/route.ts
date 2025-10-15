import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { generateImovelId } from '@/lib/imovel-id';
import { createImovelSlug } from '@/lib/slug';

export async function POST() {
  try {
    console.log('🧪 Teste de cadastro sem autenticação...');
    
    const supabase = createClient();
    
    // Buscar o primeiro usuário proprietário
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, user_type, email')
      .eq('user_type', 'proprietario')
      .limit(1);
    
    if (userError || !users || users.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum usuário proprietário encontrado',
        details: userError?.message
      });
    }
    
    const userData = users[0];
    
    console.log('✅ Usuário encontrado:', userData);
    
    // Gerar dados de teste
    const imovelId = generateImovelId();
    const slug = createImovelSlug('Apartamento Teste', imovelId);
    
    const imovelData = {
      imovel_id: imovelId,
      slug: slug,
      titulo: 'Apartamento Teste',
      descricao: 'Descrição de teste',
      preco_venda: 250000,
      area_total: 100,
      area_util: 85,
      area_terreno: 120,
      quartos: 3,
      casas_banho: 2,
      tipo_imovel: 'apartamento',
      categoria: 'venda',
      status: 'pendente',
      visibilidade: 'privado',
      morada: 'Rua Teste, 123',
      localidade: 'Lisboa',
      distrito: 'Lisboa',
      codigo_postal: '1000-001',
      proprietario_id: userData.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📝 Dados do imóvel:', imovelData);
    
    // Inserir imóvel
    const { data: imovelInserido, error: imovelError } = await supabase
      .from('imoveis')
      .insert(imovelData)
      .select()
      .single();
    
    if (imovelError) {
      console.error('❌ Erro ao inserir imóvel:', imovelError);
      return NextResponse.json({
        success: false,
        error: 'Erro ao inserir imóvel',
        details: imovelError.message,
        code: imovelError.code,
        hint: imovelError.hint
      });
    }
    
    console.log('✅ Imóvel inserido com sucesso:', imovelInserido);
    
    return NextResponse.json({
      success: true,
      message: 'Teste passou!',
      imovel: imovelInserido
    });
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
