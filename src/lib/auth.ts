import { createClient } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export interface User {
  id: string;
  email: string;
  nome_completo: string;
  user_type: string;
  admin_level: number;
  is_verified: boolean;
  is_active: boolean;
}

export interface AuthResult {
  user: User | null;
  error: string | null;
}

/**
 * Verifica se o utilizador está autenticado e retorna os dados do perfil
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthResult> {
  try {
    const supabase = createClient();
    
    // Obter token do header Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Token de autenticação não fornecido' };
    }
    
    const token = authHeader.substring(7);
    
    // Verificar token com Supabase
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !authUser) {
      return { user: null, error: 'Token inválido ou expirado' };
    }
    
    // Buscar perfil do utilizador na tabela users
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .single();
    
    if (profileError || !userProfile) {
      return { user: null, error: 'Perfil do utilizador não encontrado' };
    }
    
    // Verificar se o utilizador está ativo
    if (!userProfile.is_active) {
      return { user: null, error: 'Conta desativada' };
    }
    
    return {
      user: {
        id: userProfile.id,
        email: userProfile.email,
        nome_completo: userProfile.nome_completo,
        user_type: userProfile.user_type,
        admin_level: userProfile.admin_level,
        is_verified: userProfile.is_verified,
        is_active: userProfile.is_active
      },
      error: null
    };
    
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return { user: null, error: 'Erro interno de autenticação' };
  }
}

/**
 * Verifica se o utilizador tem permissão de admin
 */
export function isAdmin(user: User | null): boolean {
  return (user?.admin_level ?? 0) > 0;
}

/**
 * Verifica se o utilizador é super admin
 */
export function isSuperAdmin(user: User | null): boolean {
  return (user?.admin_level ?? 0) >= 3;
}

/**
 * Verifica se o utilizador pode aceder a recursos de admin
 */
export function canAccessAdmin(user: User | null): boolean {
  return (user?.admin_level ?? 0) >= 1;
}

/**
 * Verifica se o utilizador pode gerir outros utilizadores
 */
export function canManageUsers(user: User | null): boolean {
  return (user?.admin_level ?? 0) >= 2;
}

/**
 * Verifica se o utilizador pode aceder a recursos específicos do tipo
 */
export function canAccessUserType(user: User | null, requiredType: string): boolean {
  if (!user) return false;
  
  // Admins podem aceder a tudo
  if (isAdmin(user)) return true;
  
  // Verificar tipo específico
  return user.user_type === requiredType;
}

/**
 * Middleware para proteger rotas que requerem autenticação
 */
export function requireAuth(handler: (request: NextRequest, user: User) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const { user, error } = await getAuthenticatedUser(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: error || 'Não autenticado' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(request, user);
  };
}

/**
 * Middleware para proteger rotas que requerem permissão de admin
 */
export function requireAdmin(handler: (request: NextRequest, user: User) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const { user, error } = await getAuthenticatedUser(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: error || 'Não autenticado' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (!canAccessAdmin(user)) {
      return new Response(
        JSON.stringify({ error: 'Acesso negado: necessita permissão de admin' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(request, user);
  };
}

/**
 * Middleware para proteger rotas que requerem super admin
 */
export function requireSuperAdmin(handler: (request: NextRequest, user: User) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const { user, error } = await getAuthenticatedUser(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: error || 'Não autenticado' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (!isSuperAdmin(user)) {
      return new Response(
        JSON.stringify({ error: 'Acesso negado: necessita permissão de super admin' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(request, user);
  };
}
