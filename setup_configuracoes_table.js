const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase local
const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupConfiguracoesTable() {
  console.log('🔧 Configurando tabela de configurações...');

  try {
    // SQL para criar a tabela
    const createTableSQL = `
      -- Criar tabela para configurações do utilizador
      CREATE TABLE IF NOT EXISTS user_configuracoes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        configuracoes JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Executar SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });

    if (error) {
      console.error('❌ Erro ao criar tabela:', error);
      return;
    }

    console.log('✅ Tabela user_configuracoes criada com sucesso');

    // Criar índice
    const createIndexSQL = `
      CREATE INDEX IF NOT EXISTS idx_user_configuracoes_user_id ON user_configuracoes(user_id);
    `;

    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: createIndexSQL
    });

    if (indexError) {
      console.error('❌ Erro ao criar índice:', indexError);
    } else {
      console.log('✅ Índice criado com sucesso');
    }

    // Criar trigger
    const createTriggerSQL = `
      CREATE OR REPLACE FUNCTION update_user_configuracoes_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_update_user_configuracoes_updated_at ON user_configuracoes;
      CREATE TRIGGER trigger_update_user_configuracoes_updated_at
        BEFORE UPDATE ON user_configuracoes
        FOR EACH ROW
        EXECUTE FUNCTION update_user_configuracoes_updated_at();
    `;

    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql: createTriggerSQL
    });

    if (triggerError) {
      console.error('❌ Erro ao criar trigger:', triggerError);
    } else {
      console.log('✅ Trigger criado com sucesso');
    }

    // Configurar RLS
    const rlsSQL = `
      ALTER TABLE user_configuracoes ENABLE ROW LEVEL SECURITY;

      -- Política para permitir que utilizadores vejam apenas suas próprias configurações
      DROP POLICY IF EXISTS "Utilizadores podem ver suas próprias configurações" ON user_configuracoes;
      CREATE POLICY "Utilizadores podem ver suas próprias configurações" ON user_configuracoes
        FOR SELECT USING (
          user_id IN (
            SELECT id FROM users WHERE auth_user_id = auth.uid()
          )
        );

      -- Política para permitir que utilizadores atualizem suas próprias configurações
      DROP POLICY IF EXISTS "Utilizadores podem atualizar suas próprias configurações" ON user_configuracoes;
      CREATE POLICY "Utilizadores podem atualizar suas próprias configurações" ON user_configuracoes
        FOR UPDATE USING (
          user_id IN (
            SELECT id FROM users WHERE auth_user_id = auth.uid()
          )
        );

      -- Política para permitir que utilizadores criem suas próprias configurações
      DROP POLICY IF EXISTS "Utilizadores podem criar suas próprias configurações" ON user_configuracoes;
      CREATE POLICY "Utilizadores podem criar suas próprias configurações" ON user_configuracoes
        FOR INSERT WITH CHECK (
          user_id IN (
            SELECT id FROM users WHERE auth_user_id = auth.uid()
          )
        );
    `;

    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: rlsSQL
    });

    if (rlsError) {
      console.error('❌ Erro ao configurar RLS:', rlsError);
    } else {
      console.log('✅ RLS configurado com sucesso');
    }

    console.log('🎉 Configuração da tabela concluída!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar configuração
setupConfiguracoesTable();
