import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = createClient();
    
    // 1. Adicionar coluna imovel_id se não existir
    const { error: imovelIdError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'imoveis' AND column_name = 'imovel_id'
          ) THEN
            ALTER TABLE imoveis ADD COLUMN imovel_id VARCHAR(6) UNIQUE;
          END IF;
        END $$;
      `
    });

    if (imovelIdError) {
      console.log('Erro ao adicionar imovel_id:', imovelIdError);
    }

    // 2. Corrigir constraint de exposicao_solar
    await supabase.rpc('exec_sql', {
      sql: `
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.check_constraints 
            WHERE constraint_name = 'imoveis_exposicao_solar_check'
          ) THEN
            ALTER TABLE imoveis DROP CONSTRAINT imoveis_exposicao_solar_check;
          END IF;
        END $$;
        
        ALTER TABLE imoveis ADD CONSTRAINT imoveis_exposicao_solar_check 
        CHECK (exposicao_solar IS NULL OR exposicao_solar IN ('manha', 'tarde', 'todo_dia'));
      `
    });

    // 3. Corrigir constraint de estado_conservacao
    await supabase.rpc('exec_sql', {
      sql: `
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.check_constraints 
            WHERE constraint_name = 'imoveis_estado_conservacao_check'
          ) THEN
            ALTER TABLE imoveis DROP CONSTRAINT imoveis_estado_conservacao_check;
          END IF;
        END $$;
        
        ALTER TABLE imoveis ADD CONSTRAINT imoveis_estado_conservacao_check 
        CHECK (estado_conservacao IS NULL OR estado_conservacao IN ('excelente', 'muito_bom', 'bom', 'regular', 'ruim'));
      `
    });

    // 4. Corrigir tabela imoveis_media
    await supabase.rpc('exec_sql', {
      sql: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'imoveis_media' AND column_name = 'nome_arquivo'
          ) THEN
            ALTER TABLE imoveis_media ADD COLUMN nome_arquivo VARCHAR(255) NOT NULL DEFAULT 'foto.jpg';
          END IF;

          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'imoveis_media' AND column_name = 'caminho_arquivo'
          ) THEN
            ALTER TABLE imoveis_media ADD COLUMN caminho_arquivo VARCHAR(500) NOT NULL DEFAULT '/uploads/default.jpg';
          END IF;
        END $$;
      `
    });

    // 5. Atualizar dados existentes
    await supabase.rpc('exec_sql', {
      sql: `
        UPDATE imoveis 
        SET imovel_id = 'APT' || LPAD(EXTRACT(EPOCH FROM created_at)::integer % 1000, 3, '0')
        WHERE imovel_id IS NULL;
      `
    });

    await supabase.rpc('exec_sql', {
      sql: `
        UPDATE imoveis_media 
        SET 
          nome_arquivo = 'foto-' || id || '.jpg',
          caminho_arquivo = '/uploads/imoveis/' || imovel_id || '/foto-' || id || '.jpg'
        WHERE nome_arquivo IS NULL OR caminho_arquivo IS NULL;
      `
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Schema de imóveis corrigido com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao corrigir schema:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + error.message },
      { status: 500 }
    );
  }
}
