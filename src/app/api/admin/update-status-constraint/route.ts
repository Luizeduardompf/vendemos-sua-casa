import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Como não podemos executar DDL via Supabase client, vamos retornar instruções
    return NextResponse.json({
      success: false,
      message: 'Execute o SQL manualmente no Supabase Dashboard',
      sql: `
-- Execute este SQL no Supabase Dashboard > SQL Editor:

-- 1. Remover constraint existente
ALTER TABLE imoveis DROP CONSTRAINT IF EXISTS imoveis_status_check;

-- 2. Criar nova constraint com todos os status permitidos
ALTER TABLE imoveis ADD CONSTRAINT imoveis_status_check 
CHECK (status IN ('publicado', 'pendente', 'inativo', 'finalizado'));

-- 3. Adicionar comentário explicativo
COMMENT ON CONSTRAINT imoveis_status_check ON imoveis IS 'Status permitidos: publicado, pendente, inativo, finalizado';
      `,
      instructions: [
        '1. Acesse o Supabase Dashboard',
        '2. Vá para SQL Editor',
        '3. Cole e execute o SQL acima',
        '4. Teste novamente a funcionalidade de inativar imóveis'
      ],
      currentStatus: 'A constraint atual só permite: publicado, pendente, inativo',
      newStatus: 'Após atualização permitirá: publicado, pendente, inativo, finalizado'
    });
    
  } catch (error) {
    console.error('Erro na API de atualização de constraint:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
