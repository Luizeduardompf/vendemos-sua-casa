'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        console.log('🔵 Iniciando callback de autenticação...');
        console.log('🔵 URL atual:', window.location.href);
        console.log('🔵 Hash:', window.location.hash);
        console.log('🔵 Search params:', window.location.search);
        
        // Timeout para evitar loops infinitos
        const timeoutId = setTimeout(() => {
          console.error('❌ Timeout no callback - redirecionando para login');
          window.location.href = '/auth/login?error=timeout';
        }, 10000); // 10 segundos
        
        // Obter a sessão atual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('🔵 Resultado getSession:');
        console.log('🔵 Session:', session);
        console.log('🔵 Session Error:', sessionError);
        
        if (sessionError) {
          console.error('❌ Erro na sessão:', sessionError);
          console.error('❌ Session Error Code:', sessionError.code);
          console.error('❌ Session Error Message:', sessionError.message);
          setError('Erro na autenticação');
          return;
        }

        if (!session?.user) {
          console.error('❌ Nenhuma sessão encontrada');
          console.error('❌ Session object:', session);
          setError('Sessão não encontrada');
          return;
        }
        
        console.log('✅ Sessão encontrada:', session.user);

        // Salvar o token no localStorage para o dashboard
        if (session.access_token) {
          console.log('🔵 Salvando token no localStorage...');
          localStorage.setItem('access_token', session.access_token);
          localStorage.setItem('user_id', session.user.id);
          localStorage.setItem('user_email', session.user.email || '');
          console.log('✅ Token salvo no localStorage');
        }

        // Verificar se o utilizador existe na tabela users
        console.log('🔵 Verificando utilizador na tabela users...');
        console.log('🔵 Auth User ID:', session.user.id);
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single();

        console.log('🔵 Resultado da consulta users:');
        console.log('🔵 User Data:', userData);
        console.log('🔵 User Error:', userError);

        if (userError && userError.code !== 'PGRST116') {
          console.error('❌ Erro ao verificar utilizador:', userError);
          console.error('❌ User Error Code:', userError.code);
          console.error('❌ User Error Message:', userError.message);
          setError('Erro ao verificar dados do utilizador');
          return;
        }

        // Se o utilizador não existe, verificar se já existe no Supabase Auth
        if (!userData) {
          console.log('🔵 Utilizador não existe na tabela users, verificando Auth...');
          console.log('🔵 User metadata:', session.user.user_metadata);
          console.log('🔵 User email:', session.user.email);
          console.log('🔵 Session user ID:', session.user.id);
          
          // Verificar se o usuário já existe no Supabase Auth
          const { data: authUser } = await supabase.auth.getUser();
          console.log('🔵 Auth User:', authUser);
          
          if (authUser.user && authUser.user.email === session.user.email) {
            console.log('🔵 Usuário existe no Auth, criando perfil na tabela users...');
          } else {
            console.log('🔵 Usuário não existe no Auth, criando via API...');
          }
          
          // Verificar se já existe um usuário com o mesmo auth_user_id
          const { data: existingUserByAuthId } = await supabase
            .from('users')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single();
          
          if (existingUserByAuthId) {
            console.log('🔵 Usuário já existe com auth_user_id, atualizando dados...');
            // Atualizar dados do usuário existente
            const updateData = {
              email: session.user.email,
              nome_completo: session.user.user_metadata?.full_name || session.user.email,
              telefone: session.user.user_metadata?.phone_number || session.user.phone,
              foto_perfil: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
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
            
            const { error: updateError } = await supabase
              .from('users')
              .update(updateData)
              .eq('auth_user_id', session.user.id);
            
            if (updateError) {
              console.error('❌ Erro ao atualizar usuário:', updateError);
              setError('Erro ao atualizar dados do utilizador');
              return;
            }
            
            console.log('✅ Usuário atualizado com sucesso');
            // Continuar com o fluxo normal
            return;
          }
          
          const userDataToCreate = {
            email: session.user.email,
            password: 'social_login_temp_password', // Password temporária
            nome_completo: session.user.user_metadata?.full_name || session.user.email,
            telefone: session.user.user_metadata?.phone_number || session.user.phone,
            user_type: 'proprietario', // Default para social login
            aceita_termos: true,
            aceita_privacidade: true,
            aceita_marketing: false,
            // Dados adicionais do Google
            foto_perfil: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            primeiro_nome: session.user.user_metadata?.given_name || session.user.user_metadata?.first_name,
            ultimo_nome: session.user.user_metadata?.family_name || session.user.user_metadata?.last_name,
            nome_exibicao: session.user.user_metadata?.name || session.user.user_metadata?.display_name,
            provedor: 'google',
            provedor_id: session.user.user_metadata?.sub || session.user.id,
            localizacao: session.user.user_metadata?.locale,
            email_verificado: session.user.email_confirmed_at ? true : false,
            foto_manual: false, // Foto do Google, não manual
            dados_sociais: {
              google_id: session.user.user_metadata?.sub || session.user.id,
              avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              locale: session.user.user_metadata?.locale,
              verified_email: session.user.user_metadata?.email_verified || false,
              raw_data: session.user.user_metadata
            }
          };
          
          console.log('🔵 Dados para criar utilizador:', userDataToCreate);
          console.log('🔵 JSON stringificado:', JSON.stringify(userDataToCreate, null, 2));
          
          // Usar a API para criar o utilizador
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDataToCreate),
          });

          console.log('🔵 Resposta da API register:');
          console.log('🔵 Status:', response.status);
          console.log('🔵 OK:', response.ok);
          console.log('🔵 Headers:', Object.fromEntries(response.headers.entries()));
          
          const responseData = await response.json();
          console.log('🔵 Response Data:', responseData);
          console.log('🔵 Response Data Type:', typeof responseData);
          console.log('🔵 Response Data Keys:', Object.keys(responseData));

          if (!response.ok) {
            console.error('❌ Erro ao criar utilizador via API:');
            console.error('❌ Status:', response.status);
            console.error('❌ Response Data:', responseData);
            console.error('❌ Response Data String:', JSON.stringify(responseData, null, 2));
            
            // Se o email já está registado, continuar com o fluxo normal
            if (responseData.error && responseData.error.includes('já está registado')) {
              console.log('🔵 Email já registado, continuando com fluxo normal...');
              // Continuar com o fluxo normal - o usuário já existe
              return;
            }
            
            setError(`Erro ao criar perfil do utilizador: ${responseData.error || 'Erro desconhecido'}`);
            return;
          }
          
          console.log('✅ Utilizador criado com sucesso via API');
        } else {
          console.log('✅ Utilizador já existe na tabela users');
          
          // Atualizar dados do usuário existente com informações do Google
          console.log('🔵 Atualizando dados do utilizador existente...');
          
          // Verificar se a foto foi alterada manualmente
          const shouldUpdatePhoto = !userData.foto_manual;
          console.log('🔵 Foto manual:', userData.foto_manual);
          console.log('🔵 Deve atualizar foto:', shouldUpdatePhoto);
          
          const updateData: Record<string, unknown> = {
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
          
          // Só atualizar foto se não foi alterada manualmente
          if (shouldUpdatePhoto) {
            updateData.foto_perfil = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
            console.log('🔵 Atualizando foto do Google:', updateData.foto_perfil);
          } else {
            console.log('🔵 Preservando foto manual do usuário');
          }
          
          console.log('🔵 Dados para atualizar utilizador:', updateData);
          
          // Atualizar usuário existente
          const updateResponse = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          });
          
          if (updateResponse.ok) {
            console.log('✅ Dados do utilizador atualizados com sucesso');
          } else {
            console.log('⚠️ Erro ao atualizar dados do utilizador, mas continuando...');
          }
        }

        // Redirecionar baseado no tipo de utilizador
        const userType = userData?.user_type || 'proprietario';
        console.log('🔵 Redirecionando para dashboard...');
        console.log('🔵 User Type:', userType);
        console.log('🔵 User data completo:', userData);
        
        // Definir URL de redirecionamento
        let redirectUrl = '/dashboard/proprietario'; // Default
        
        switch (userType) {
          case 'proprietario':
            console.log('✅ Redirecionando para dashboard do proprietário');
            redirectUrl = '/dashboard/proprietario';
            break;
          case 'agente':
            console.log('✅ Redirecionando para dashboard do agente');
            redirectUrl = '/dashboard/agente';
            break;
          case 'imobiliaria':
            console.log('✅ Redirecionando para dashboard da imobiliária');
            redirectUrl = '/dashboard/imobiliaria';
            break;
          case 'admin':
          case 'super_admin':
            console.log('✅ Redirecionando para dashboard de admin');
            redirectUrl = '/admin/dashboard';
            break;
          default:
            console.log('✅ Redirecionando para dashboard padrão (proprietário)');
            redirectUrl = '/dashboard/proprietario';
        }
        
        console.log('🔵 URL de redirecionamento:', redirectUrl);
        console.log('🔵 Executando redirecionamento...');
        
        // Limpar timeout
        clearTimeout(timeoutId);
        
        // Usar window.location.href para forçar redirecionamento
        window.location.href = redirectUrl;

      } catch (error) {
        console.error('❌ Erro inesperado no callback:', error);
        console.error('❌ Error type:', typeof error);
        console.error('❌ Error constructor:', error?.constructor?.name);
        console.error('❌ Full error object:', JSON.stringify(error, null, 2));
        setError('Erro inesperado durante a autenticação');
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [router, supabase]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro na Autenticação
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={() => router.push('/auth/login')}
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