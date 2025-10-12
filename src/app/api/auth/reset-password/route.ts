import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { z } from 'zod';

// Schema de validação para redefinir password
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords não coincidem",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = resetPasswordSchema.parse(body);
    
    const supabase = createClient();
    
    // Verificar se o utilizador está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Sessão inválida. Faça login novamente' },
        { status: 401 }
      );
    }
    
    // Atualizar password no Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: validatedData.password
    });
    
    if (updateError) {
      console.error('Erro ao atualizar password:', updateError);
      return NextResponse.json(
        { error: 'Erro ao atualizar password' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Password atualizada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao redefinir password:', error);
    
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
