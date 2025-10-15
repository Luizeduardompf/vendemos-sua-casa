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
    
    // Criar usuário
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    });
    
    if (authError) {
      return NextResponse.json({ 
        error: 'Erro ao criar usuário',
        details: authError.message 
      });
    }
    
    if (!authData.user) {
      return NextResponse.json({ 
        error: 'Falha ao criar usuário',
        authData: authData
      });
    }
    
    // Criar perfil na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        auth_user_id: authData.user.id,
        email: authData.user.email,
        user_type: 'proprietario',
        nome_exibicao: 'Usuário Teste',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (userError) {
      console.log('⚠️ Erro ao criar perfil, mas usuário foi criado:', userError.message);
    }
    
    return NextResponse.json({ 
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email
      },
      message: 'Usuário criado com sucesso. Faça login para obter o token.'
    });
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error);
    return NextResponse.json({ 
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

