import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { z } from 'zod';

// Schema de validação para recuperação de password
const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = forgotPasswordSchema.parse(body);
    
    const supabase = createClient();
    
    // Verificar se o email existe na base de dados
    const { data: userProfile } = await supabase
      .from('users')
      .select('id, email, nome_completo, is_active')
      .eq('email', validatedData.email)
      .single();
    
    if (!userProfile) {
      // Por segurança, não revelar se o email existe ou não
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver registado, receberá instruções para redefinir a password'
      });
    }
    
    // Verificar se a conta está ativa
    if (!userProfile.is_active) {
      return NextResponse.json(
        { error: 'Conta desativada. Contacte o suporte' },
        { status: 403 }
      );
    }
    
    // Enviar email de recuperação de password
    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
    });
    
    if (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      return NextResponse.json(
        { error: 'Erro ao enviar email de recuperação' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Se o email estiver registado, receberá instruções para redefinir a password'
    });
    
  } catch (error) {
    console.error('Erro na recuperação de password:', error);
    
    if (error instanceof z.ZodError) {
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
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
