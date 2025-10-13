'use client';

import { useEffect, useState, Suspense } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function AuthCallbackContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        console.log('🔵 Callback SIMPLIFICADO iniciado...');
        
        // Timeout de 5 segundos
        const timeoutId = setTimeout(() => {
          console.error('❌ Timeout - redirecionando para login');
          window.location.href = '/auth/login?error=timeout';
        }, 5000);
        
        // Obter sessão
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          console.error('❌ Sem sessão válida');
          window.location.href = '/auth/login?error=no_session';
          return;
        }
        
        console.log('✅ Sessão válida:', session.user.email);

        // Salvar token
        if (session.access_token) {
          localStorage.setItem('access_token', session.access_token);
          localStorage.setItem('user_id', session.user.id);
          localStorage.setItem('user_email', session.user.email || '');
        }

        // Verificar se usuário existe
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single();

        console.log('🔵 Usuário existe?', userData ? 'Sim' : 'Não');

        // Se não existe, criar básico
        if (!userData) {
          console.log('🔵 Criando usuário básico...');
          
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              auth_user_id: session.user.id,
              email: session.user.email,
              nome_completo: session.user.user_metadata?.full_name || session.user.email,
              user_type: 'proprietario',
              is_verified: true,
              is_active: true,
              foto_perfil: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              provedor: 'google',
              provedor_id: session.user.user_metadata?.sub || session.user.id
            });
          
          if (insertError) {
            console.error('❌ Erro ao criar usuário:', insertError);
            // Continuar mesmo com erro
          } else {
            console.log('✅ Usuário criado');
          }
        }

        // Limpar timeout
        clearTimeout(timeoutId);
        
        // Redirecionar
        console.log('🔵 Redirecionando para dashboard...');
        window.location.href = '/dashboard/proprietario';

      } catch (error) {
        console.error('❌ Erro no callback:', error);
        window.location.href = '/auth/login?error=callback_error';
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [supabase]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erro na Autenticação
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          A processar autenticação...
        </h2>
        <p className="text-gray-600">
          Por favor aguarde enquanto completamos o seu login.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            A carregar...
          </h2>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
