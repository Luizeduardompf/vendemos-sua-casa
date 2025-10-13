-- =============================================
-- VENDEMOS SUA CASA - ADICIONAR CAMPOS DE VERIFICAÇÃO
-- =============================================
-- Adicionar campos para controle de verificação de email, telefone e análise da conta

-- Adicionar campos de verificação à tabela users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email_verificado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS telefone_verificado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS conta_analisada BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS data_verificacao_email TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_verificacao_telefone TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_analise_conta TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status_analise VARCHAR(20) DEFAULT 'pending' CHECK (status_analise IN ('pending', 'approved', 'rejected', 'under_review'));

-- Comentários para documentação
COMMENT ON COLUMN public.users.email_verificado IS 'Indica se o email foi verificado via OTP ou confirmação';
COMMENT ON COLUMN public.users.telefone_verificado IS 'Indica se o telefone foi verificado via OTP';
COMMENT ON COLUMN public.users.conta_analisada IS 'Indica se a conta foi analisada por um funcionário';
COMMENT ON COLUMN public.users.data_verificacao_email IS 'Data e hora da verificação do email';
COMMENT ON COLUMN public.users.data_verificacao_telefone IS 'Data e hora da verificação do telefone';
COMMENT ON COLUMN public.users.data_analise_conta IS 'Data e hora da análise da conta';
COMMENT ON COLUMN public.users.status_analise IS 'Status da análise: pending, approved, rejected, under_review';

-- Atualizar contas existentes para ter status de pendente
UPDATE public.users 
SET 
  email_verificado = CASE 
    WHEN email_verificado IS NOT NULL THEN email_verificado 
    ELSE FALSE 
  END,
  telefone_verificado = FALSE,
  conta_analisada = FALSE,
  status_analise = 'pending'
WHERE status_analise IS NULL;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email_verificado ON public.users(email_verificado);
CREATE INDEX IF NOT EXISTS idx_users_telefone_verificado ON public.users(telefone_verificado);
CREATE INDEX IF NOT EXISTS idx_users_conta_analisada ON public.users(conta_analisada);
CREATE INDEX IF NOT EXISTS idx_users_status_analise ON public.users(status_analise);

-- Atualizar view para incluir novos campos
CREATE OR REPLACE VIEW public.users_with_verification AS
SELECT 
  u.*,
  CASE 
    WHEN u.email_verificado = TRUE THEN 'verified'
    ELSE 'pending'
  END as email_status,
  CASE 
    WHEN u.telefone_verificado = TRUE THEN 'verified'
    ELSE 'pending'
  END as telefone_status,
  CASE 
    WHEN u.conta_analisada = TRUE AND u.status_analise = 'approved' THEN 'approved'
    WHEN u.conta_analisada = TRUE AND u.status_analise = 'rejected' THEN 'rejected'
    WHEN u.status_analise = 'under_review' THEN 'under_review'
    ELSE 'pending'
  END as conta_status
FROM public.users u;
