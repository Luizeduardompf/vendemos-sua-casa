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

-- 1. Desabilitar RLS temporariamente na tabela de histórico
ALTER TABLE imoveis_status_history DISABLE ROW LEVEL SECURITY;

-- 2. Ou criar uma política mais permissiva
DROP POLICY IF EXISTS "Users can view status history of their own properties" ON imoveis_status_history;
DROP POLICY IF EXISTS "Users can create status history records" ON imoveis_status_history;
DROP POLICY IF EXISTS "Users can update status history observations" ON imoveis_status_history;

-- 3. Criar política mais simples
CREATE POLICY "Allow all operations on status history" ON imoveis_status_history
    FOR ALL USING (true) WITH CHECK (true);
      `,
      instructions: [
        '1. Acesse o Supabase Dashboard',
        '2. Vá para SQL Editor',
        '3. Cole e execute o SQL acima',
        '4. Teste novamente a funcionalidade de histórico'
      ],
      currentStatus: 'RLS está bloqueando inserções na tabela de histórico',
      solution: 'Desabilitar RLS ou criar política mais permissiva'
    });
    
  } catch (error) {
    console.error('Erro na API de desabilitação de RLS:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

