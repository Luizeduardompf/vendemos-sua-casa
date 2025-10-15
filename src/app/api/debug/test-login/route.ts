import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email e senha são obrigatórios' 
      });
    }
    
    const supabase = createClient();
    
    // Tentar fazer login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      return NextResponse.json({ 
        error: 'Erro no login',
        details: authError.message 
      });
    }
    
    if (!authData.user || !authData.session) {
      return NextResponse.json({ 
        error: 'Login falhou',
        user: authData.user,
        session: authData.session
      });
    }
    
    return NextResponse.json({ 
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email
      },
      access_token: authData.session.access_token,
      expires_at: authData.session.expires_at
    });
    
  } catch (error) {
    console.error('❌ Erro no teste de login:', error);
    return NextResponse.json({ 
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

