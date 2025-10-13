'use client';

import { useEffect, useState, Suspense } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function AuthCallbackContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log('🔵 AuthCallbackContent renderizado!');
  console.log('🔵 isLoading:', isLoading);
  console.log('🔵 error:', error);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    console.log('🔵 Callback useEffect executado!');
    console.log('🔵 URL atual:', window.location.href);
    console.log('🔵 Pathname:', window.location.pathname);
    console.log('🔵 Search params:', window.location.search);
    
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        console.log('🔵 Callback SIMPLIFICADO iniciado...');
        console.log('🔵 URL atual:', window.location.href);
        console.log('🔵 Search params:', window.location.search);
        
        // Timeout de 5 segundos
        const timeoutId = setTimeout(() => {
          console.error('❌ Timeout - redirecionando para login');
          window.location.href = '/auth/login?error=timeout';
        }, 5000);
        
        // Obter sessão
        console.log('🔵 Tentando obter sessão do Supabase...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('🔵 Resultado da sessão:');
        console.log('🔵 Session:', session);
        console.log('🔵 Session Error:', sessionError);
        
        if (sessionError || !session?.user) {
          console.error('❌ Sem sessão válida');
          console.error('❌ Session Error:', sessionError);
          console.error('❌ Session:', session);
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
        const { data: userData, error: userQueryError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();

        console.log('🔵 Usuário existe?', userData ? 'Sim' : 'Não');
        console.log('🔵 User Query Error:', userQueryError);
        console.log('🔵 User Data encontrado:', userData);
        console.log('🔵 Google metadata:', session.user.user_metadata);
        console.log('🔵 Avatar URL:', session.user.user_metadata?.avatar_url);
        console.log('🔵 Picture:', session.user.user_metadata?.picture);
        console.log('🔵 Full name:', session.user.user_metadata?.full_name);
        console.log('🔵 Auth User ID:', session.user.id);

        // Se não existe, criar básico
        if (!userData) {
          console.log('🔵 Criando usuário básico...');
          
          const userDataToCreate = {
            auth_user_id: session.user.id,
            email: session.user.email,
            nome_completo: session.user.user_metadata?.full_name || session.user.email,
            telefone: session.user.user_metadata?.phone_number || session.user.phone,
            user_type: 'proprietario',
            is_verified: true,
            is_active: true,
            aceita_termos: true,
            aceita_privacidade: true,
            aceita_marketing: false,
            // Campos de verificação
            email_verificado: true, // Google já verificou o email
            telefone_verificado: false, // Sempre pendente no início
            conta_analisada: false, // Sempre pendente no início
            status_analise: 'pending', // Todas as contas iniciam como pendentes
            // Dados completos do Google
            foto_perfil: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            primeiro_nome: session.user.user_metadata?.given_name || session.user.user_metadata?.first_name,
            ultimo_nome: session.user.user_metadata?.family_name || session.user.user_metadata?.last_name,
            nome_exibicao: session.user.user_metadata?.name || session.user.user_metadata?.display_name,
            provedor: 'google',
            provedor_id: session.user.user_metadata?.sub || session.user.id,
            localizacao: session.user.user_metadata?.locale,
            foto_manual: false,
            dados_sociais: {
              google_id: session.user.user_metadata?.sub || session.user.id,
              avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              locale: session.user.user_metadata?.locale,
              verified_email: session.user.user_metadata?.email_verified || false,
              raw_data: session.user.user_metadata
            }
          };
          
          console.log('🔵 Dados para criar usuário:', userDataToCreate);
          console.log('🔵 Foto capturada:', userDataToCreate.foto_perfil);
          console.log('🔵 Avatar URL direto:', session.user.user_metadata?.avatar_url);
          console.log('🔵 Picture direto:', session.user.user_metadata?.picture);
          
          const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert(userDataToCreate)
            .select();
          
          if (insertError) {
            console.error('❌ Erro ao criar usuário:', insertError);
            console.error('❌ Dados que causaram erro:', userDataToCreate);
            console.error('❌ Detalhes do erro:', JSON.stringify(insertError, null, 2));
            // Continuar mesmo com erro
          } else {
            console.log('✅ Usuário criado com sucesso:', insertData);
            console.log('✅ Usuário criado com ID:', insertData?.[0]?.id);
          }
        } else {
          console.log('🔵 Usuário já existe, atualizando dados...');
          console.log('🔵 Foto manual atual:', userData.foto_manual);
          
          // Atualizar dados do usuário existente
          const updateData: any = {
            email: session.user.email,
            nome_completo: session.user.user_metadata?.full_name || session.user.email,
            telefone: session.user.user_metadata?.phone_number || session.user.phone,
            primeiro_nome: session.user.user_metadata?.given_name || session.user.user_metadata?.first_name,
            ultimo_nome: session.user.user_metadata?.family_name || session.user.user_metadata?.last_name,
            nome_exibicao: session.user.user_metadata?.name || session.user.user_metadata?.display_name,
            provedor: 'google',
            provedor_id: session.user.user_metadata?.sub || session.user.id,
            localizacao: session.user.user_metadata?.locale,
            email_verificado: session.user.email_confirmed_at ? true : false,
            dados_sociais: {
              google_id: session.user.user_metadata?.sub || session.user.id,
              avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              locale: session.user.user_metadata?.locale,
              verified_email: session.user.user_metadata?.email_verified || false,
              raw_data: session.user.user_metadata
            }
          };
          
          // Só atualizar foto se não foi enviada manualmente
          if (!userData.foto_manual) {
            updateData.foto_perfil = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
            console.log('🔵 Atualizando foto do Google (não é manual)');
          } else {
            console.log('🔵 Mantendo foto manual, não sobrescrevendo');
          }
          
          console.log('🔵 Dados para atualizar usuário:', updateData);
          console.log('🔵 Foto para atualizar:', updateData.foto_perfil);
          
          const { error: updateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('auth_user_id', session.user.id);
          
          if (updateError) {
            console.error('❌ Erro ao atualizar usuário:', updateError);
          } else {
            console.log('✅ Usuário atualizado');
          }
        }

        // Limpar timeout
        clearTimeout(timeoutId);
        
        // Redirecionar
        // Verificar se é usuário novo (primeira vez) para sugerir definir senha
        const isNewUser = !userData;
        
        if (isNewUser) {
          console.log('🔵 Usuário novo, redirecionando para definir senha...');
          console.log('🔵 Token salvo:', localStorage.getItem('access_token') ? 'Sim' : 'Não');
          console.log('🔵 User ID salvo:', localStorage.getItem('user_id'));
          console.log('🔵 User Email salvo:', localStorage.getItem('user_email'));
          
          setTimeout(() => {
            const redirectUrl = `/auth/set-password?email=${encodeURIComponent(session.user.email || '')}`;
            console.log('🔵 Executando redirecionamento para definir senha...');
            window.location.href = redirectUrl;
          }, 1000);
        } else {
          console.log('🔵 Usuário existente, redirecionando para dashboard...');
          console.log('🔵 Token salvo:', localStorage.getItem('access_token') ? 'Sim' : 'Não');
          console.log('🔵 User ID salvo:', localStorage.getItem('user_id'));
          console.log('🔵 User Email salvo:', localStorage.getItem('user_email'));
          
          setTimeout(() => {
            console.log('🔵 Executando redirecionamento para dashboard...');
            window.location.href = '/dashboard/proprietario';
          }, 1000);
        }

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
