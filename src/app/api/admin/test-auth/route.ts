import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    
    // Verificar se há sessão ativa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔍 Sessão:', session?.user?.id);
    console.log('🔍 Erro da sessão:', sessionError);
    
    if (session?.user) {
      return NextResponse.json({
        success: true,
        userId: session.user.id,
        email: session.user.email
      });
    }
    
    // Verificar Authorization header
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Authorization header:', authHeader);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('🔍 Token:', token.substring(0, 20) + '...');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      console.log('🔍 Usuário do token:', user?.id);
      console.log('🔍 Erro do token:', userError);
      
      if (user) {
        return NextResponse.json({
          success: true,
          userId: user.id,
          email: user.email,
          method: 'token'
        });
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Nenhuma autenticação encontrada'
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
