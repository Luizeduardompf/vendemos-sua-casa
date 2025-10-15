import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient();
    
    // Criar a tabela diretamente
    const { data: createTable, error: createError } = await supabase
      .from('imoveis_status_history')
      .select('*')
      .limit(1);
    
    if (createError && createError.code === 'PGRST116') {
      // Tabela não existe, vamos criar
      console.log('Tabela não existe, criando...');
      
      // Como não podemos executar DDL via Supabase client, vamos retornar instruções
      return NextResponse.json({
        success: false,
        message: 'Tabela não existe. Execute o SQL manualmente no Supabase Dashboard.',
        sql: `
-- Execute este SQL no Supabase Dashboard:

CREATE TABLE IF NOT EXISTS imoveis_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    imovel_id UUID NOT NULL REFERENCES imoveis(id) ON DELETE CASCADE,
    status_anterior VARCHAR(50),
    status_novo VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    motivo TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_imoveis_status_history_imovel_id ON imoveis_status_history(imovel_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_status_history_user_id ON imoveis_status_history(user_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_status_history_created_at ON imoveis_status_history(created_at);

-- Função para registrar mudança
CREATE OR REPLACE FUNCTION registrar_mudanca_status_imovel(
    p_imovel_id UUID,
    p_status_anterior VARCHAR(50),
    p_status_novo VARCHAR(50),
    p_user_id UUID DEFAULT NULL,
    p_motivo TEXT DEFAULT NULL,
    p_observacoes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_history_id UUID;
BEGIN
    INSERT INTO imoveis_status_history (
        imovel_id, status_anterior, status_novo, user_id, motivo, observacoes
    ) VALUES (
        p_imovel_id, p_status_anterior, p_status_novo, p_user_id, p_motivo, p_observacoes
    ) RETURNING id INTO v_history_id;
    RETURN v_history_id;
END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE imoveis_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view status history of their own properties" ON imoveis_status_history
    FOR SELECT USING (
        imovel_id IN (SELECT id FROM imoveis WHERE proprietario_id = auth.uid())
    );

CREATE POLICY "Users can create status history records" ON imoveis_status_history
    FOR INSERT WITH CHECK (true);
        `,
        instructions: 'Copie e cole o SQL acima no Supabase Dashboard > SQL Editor e execute.'
      });
    }
    
    if (createError) {
      return NextResponse.json(
        { error: 'Erro ao verificar tabela', details: createError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Tabela de histórico de status já existe!',
      tableExists: true
    });
    
  } catch (error) {
    console.error('Erro na API de setup:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
