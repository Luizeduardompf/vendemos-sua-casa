-- Tabela para controlar o histórico de mudanças de status dos imóveis
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

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_imoveis_status_history_imovel_id ON imoveis_status_history(imovel_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_status_history_user_id ON imoveis_status_history(user_id);
CREATE INDEX IF NOT EXISTS idx_imoveis_status_history_created_at ON imoveis_status_history(created_at);
CREATE INDEX IF NOT EXISTS idx_imoveis_status_history_status_novo ON imoveis_status_history(status_novo);

-- Comentários na tabela
COMMENT ON TABLE imoveis_status_history IS 'Histórico de mudanças de status dos imóveis';
COMMENT ON COLUMN imoveis_status_history.imovel_id IS 'ID do imóvel que teve o status alterado';
COMMENT ON COLUMN imoveis_status_history.status_anterior IS 'Status anterior do imóvel (NULL para criação)';
COMMENT ON COLUMN imoveis_status_history.status_novo IS 'Novo status do imóvel';
COMMENT ON COLUMN imoveis_status_history.user_id IS 'ID do usuário que fez a alteração (NULL para sistema)';
COMMENT ON COLUMN imoveis_status_history.motivo IS 'Motivo da mudança de status';
COMMENT ON COLUMN imoveis_status_history.observacoes IS 'Observações adicionais sobre a mudança';

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_imoveis_status_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_imoveis_status_history_updated_at
    BEFORE UPDATE ON imoveis_status_history
    FOR EACH ROW
    EXECUTE FUNCTION update_imoveis_status_history_updated_at();

-- Função para registrar mudança de status
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
        imovel_id,
        status_anterior,
        status_novo,
        user_id,
        motivo,
        observacoes
    ) VALUES (
        p_imovel_id,
        p_status_anterior,
        p_status_novo,
        p_user_id,
        p_motivo,
        p_observacoes
    ) RETURNING id INTO v_history_id;
    
    RETURN v_history_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para registrar automaticamente mudanças de status na tabela imoveis
CREATE OR REPLACE FUNCTION trigger_registrar_mudanca_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Só registrar se o status realmente mudou
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        PERFORM registrar_mudanca_status_imovel(
            NEW.id,
            OLD.status,
            NEW.status,
            NULL, -- user_id será preenchido pela aplicação
            'Mudança automática de status',
            'Status alterado via sistema'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_imoveis_status_change
    AFTER UPDATE ON imoveis
    FOR EACH ROW
    EXECUTE FUNCTION trigger_registrar_mudanca_status();

-- RLS (Row Level Security)
ALTER TABLE imoveis_status_history ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam o histórico de seus próprios imóveis
CREATE POLICY "Users can view status history of their own properties" ON imoveis_status_history
    FOR SELECT USING (
        imovel_id IN (
            SELECT id FROM imoveis WHERE proprietario_id = auth.uid()
        )
    );

-- Política para permitir que usuários criem registros de histórico
CREATE POLICY "Users can create status history records" ON imoveis_status_history
    FOR INSERT WITH CHECK (true);

-- Política para permitir que usuários atualizem registros de histórico (apenas observações)
CREATE POLICY "Users can update status history observations" ON imoveis_status_history
    FOR UPDATE USING (
        imovel_id IN (
            SELECT id FROM imoveis WHERE proprietario_id = auth.uid()
        )
    ) WITH CHECK (
        imovel_id IN (
            SELECT id FROM imoveis WHERE proprietario_id = auth.uid()
        )
    );

