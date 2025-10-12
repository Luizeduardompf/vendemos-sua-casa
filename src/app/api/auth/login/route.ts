import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { z } from 'zod';

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Password é obrigatória')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = loginSchema.parse(body);
    
    const supabase = createClient();
    
    // Fazer login no Supabase Auth
    console.log('🔵 Tentando login com:', validatedData.email);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password
    });
    
    console.log('🔵 Resultado do login:');
    console.log('🔵 Auth Data:', authData);
    console.log('🔵 Auth Error:', authError);
    
    if (authError) {
      console.error('Erro no login:', authError);
      
      // Mapear erros específicos do Supabase
      if (authError.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { error: 'Email ou password incorretos' },
          { status: 401 }
        );
      }
      
      if (authError.message.includes('Email not confirmed') || authError.code === 'email_not_confirmed') {
        console.log('⚠️ Email não confirmado, verificando utilizador...');
        
        // Buscar utilizador na tabela users para verificar se existe
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('email', validatedData.email)
          .single();
          
        if (profileError || !userProfile) {
          return NextResponse.json(
            { 
              error: 'Email não confirmado. Verifique a sua caixa de correio e clique no link de confirmação.',
              code: 'EMAIL_NOT_CONFIRMED',
              needsConfirmation: true
            },
            { status: 401 }
          );
        }
        
        // Verificar se o utilizador está ativo
        if (!userProfile.is_active) {
          return NextResponse.json(
            { 
              error: 'A sua conta foi desativada. Contacte o suporte.',
              code: 'ACCOUNT_DEACTIVATED'
            },
            { status: 401 }
          );
        }
        
        // Retornar erro de confirmação com dados do utilizador
        return NextResponse.json(
          { 
            error: 'Email não confirmado. Verifique a sua caixa de correio e clique no link de confirmação.',
            code: 'EMAIL_NOT_CONFIRMED',
            needsConfirmation: true,
            user: {
              id: userProfile.id,
              email: userProfile.email,
              nome_completo: userProfile.nome_completo,
              user_type: userProfile.user_type,
              is_verified: userProfile.is_verified
            }
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: 'Erro ao fazer login' },
        { status: 401 }
      );
    }
    
    if (!authData.user) {
      return NextResponse.json(
        { error: 'Falha no login' },
        { status: 401 }
      );
    }
    
    // Buscar perfil do utilizador na tabela users
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single();
    
    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
      return NextResponse.json(
        { error: 'Erro ao buscar perfil do utilizador' },
        { status: 500 }
      );
    }
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'Perfil do utilizador não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se o utilizador está ativo
    if (!userProfile.is_active) {
      return NextResponse.json(
        { error: 'Conta desativada. Contacte o suporte' },
        { status: 403 }
      );
    }
    
    // Atualizar último login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userProfile.id);
    
    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: userProfile.id,
        email: userProfile.email,
        nome_completo: userProfile.nome_completo,
        user_type: userProfile.user_type,
        admin_level: userProfile.admin_level,
        is_verified: userProfile.is_verified,
        is_active: userProfile.is_active,
        last_login: new Date().toISOString()
      },
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at: authData.session?.expires_at
      }
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    console.error('Tipo do erro:', typeof error);
    console.error('É ZodError?', error instanceof z.ZodError);
    
    if (error instanceof z.ZodError) {
      console.log('Erro de validação Zod:', error.issues);
      try {
        return NextResponse.json(
          { 
            error: 'Dados inválidos',
            details: error.issues.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      } catch (jsonError) {
        console.error('Erro ao criar JSON:', jsonError);
        return NextResponse.json(
          { error: 'Erro de validação' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
