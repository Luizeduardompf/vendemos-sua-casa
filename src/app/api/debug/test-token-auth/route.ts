import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Auth Header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Token não fornecido',
        authHeader: authHeader 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔑 Token:', token.substring(0, 20) + '...');
    
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    console.log('👤 User:', user ? 'Encontrado' : 'Não encontrado');
    console.log('❌ Error:', error);
    
    if (error) {
      return NextResponse.json({ 
        error: 'Token inválido',
        details: error.message,
        code: error.message
      });
    }
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Usuário não encontrado',
        user: null
      });
    }
    
    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao testar token:', error);
    return NextResponse.json({ 
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

