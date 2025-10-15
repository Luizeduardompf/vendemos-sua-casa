import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    
    // Verificar sessão atual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('🔍 Sessão atual:', session ? 'Encontrada' : 'Não encontrada');
    console.log('🔍 Session Error:', sessionError);
    
    if (sessionError) {
      return NextResponse.json({ 
        error: 'Erro ao verificar sessão',
        details: sessionError.message 
      });
    }
    
    if (!session) {
      return NextResponse.json({ 
        error: 'Nenhuma sessão ativa',
        session: null 
      });
    }
    
    return NextResponse.json({ 
      success: true,
      session: {
        user: {
          id: session.user.id,
          email: session.user.email,
          created_at: session.user.created_at
        },
        access_token: session.access_token ? 'Presente' : 'Ausente',
        expires_at: session.expires_at
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao verificar sessão:', error);
    return NextResponse.json({ 
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

