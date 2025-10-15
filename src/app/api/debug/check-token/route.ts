import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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
    
    return NextResponse.json({ 
      success: true,
      tokenLength: token.length,
      tokenStart: token.substring(0, 20) + '...',
      authHeader: authHeader
    });
    
  } catch (error) {
    console.error('❌ Erro ao verificar token:', error);
    return NextResponse.json({ 
      error: 'Erro ao verificar token',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

