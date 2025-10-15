import { NextResponse } from 'next/server';
import { createClientWithCookies } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = await createClientWithCookies();
    
    // Tentar obter usuário via cookies
    const { data: { user: cookieUser }, error: cookieError } = await supabase.auth.getUser();
    
    // Tentar obter sessão via cookies
    const { data: { session: cookieSession }, error: sessionError } = await supabase.auth.getSession();
    
    return NextResponse.json({
      cookieUser: cookieUser ? {
        id: cookieUser.id,
        email: cookieUser.email,
        created_at: cookieUser.created_at
      } : null,
      cookieError: cookieError?.message,
      cookieSession: cookieSession ? {
        access_token: cookieSession.access_token ? 'present' : 'missing',
        refresh_token: cookieSession.refresh_token ? 'present' : 'missing',
        expires_at: cookieSession.expires_at,
        user: cookieSession.user ? {
          id: cookieSession.user.id,
          email: cookieSession.user.email
        } : null
      } : null,
      sessionError: sessionError?.message
    });
  } catch (error) {
    console.error('Erro na API debug auth:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

