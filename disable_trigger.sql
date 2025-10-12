-- Desativar trigger temporariamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Verificar se foi removido
SELECT 
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
  AND event_object_schema = 'auth';

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ Trigger desativado temporariamente';
  RAISE NOTICE '🧪 Agora pode testar o registo sem conflitos';
END $$;
