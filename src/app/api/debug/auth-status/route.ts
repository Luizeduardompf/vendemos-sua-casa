import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    
    // Tentar obter a sessão atual primeiro
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔵 Debug Auth - Session:', session ? 'Encontrada' : 'Não encontrada');
    console.log('🔵 Debug Auth - Session Error:', sessionError);
    
    let authUser = null;
    
    if (session?.user) {
      authUser = session.user;
      console.log('🔵 Debug Auth - Usando sessão atual');
    } else {
      // Tentar obter token do header Authorization
      const authHeader = request.headers.get('authorization');
      console.log('🔵 Debug Auth - Auth Header:', authHeader ? 'Presente' : 'Ausente');
      
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        console.log('🔵 Debug Auth - Token extraído:', token ? 'Sim' : 'Não');
        
        const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token);
        console.log('🔵 Debug Auth - User do token:', tokenUser ? 'Encontrado' : 'Não encontrado');
        console.log('🔵 Debug Auth - Token Error:', tokenError);
        
        if (tokenUser && !tokenError) {
          authUser = tokenUser;
          console.log('🔵 Debug Auth - Usando token do header');
        }
      }
    }
    
    if (!authUser) {
      return NextResponse.json({
        error: 'Nenhum usuário autenticado encontrado',
        session: !!session,
        sessionError: sessionError?.message,
        hasAuthHeader: !!request.headers.get('authorization')
      }, { status: 401 });
    }

    // Buscar dados do usuário
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (userDataError || !userData) {
      return NextResponse.json({
        error: 'Usuário não encontrado na tabela users',
        authUserId: authUser.id,
        userDataError: userDataError?.message,
        userData: userData
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      authUser: {
        id: authUser.id,
        email: authUser.email
      },
      userData: {
        id: userData.id,
        email: userData.email,
        user_type: userData.user_type
      }
    });

  } catch (error) {
    console.error('❌ Erro no debug de auth:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

