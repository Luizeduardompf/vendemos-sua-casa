import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    
    console.log('🔍 Testando autenticação...');
    
    // Tentar obter usuário da sessão
    const { data: { user: sessionUser }, error: sessionError } = await supabase.auth.getUser();
    console.log('🔍 Usuário da sessão:', sessionUser);
    console.log('🔍 Erro da sessão:', sessionError);
    
    // Tentar obter usuário do header Authorization
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Authorization header:', authHeader);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('🔍 Token extraído:', token.substring(0, 20) + '...');
      
      const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token);
      console.log('🔍 Usuário do token:', tokenUser);
      console.log('🔍 Erro do token:', tokenError);
    }
    
    return NextResponse.json({
      sessionUser,
      sessionError,
      authHeader,
      hasToken: !!authHeader
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
