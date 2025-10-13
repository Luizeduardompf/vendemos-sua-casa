import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { z } from 'zod';

// Schema de validação para definir senha
const setPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = setPasswordSchema.parse(body);
    
    const supabase = createClient();
    
    // Verificar se usuário existe e é social
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', validatedData.email)
      .maybeSingle();

    if (userError) {
      console.error('Erro ao buscar usuário:', userError);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se é conta social
    if (existingUser.provedor === 'email') {
      return NextResponse.json(
        { error: 'Esta conta já possui senha definida' },
        { status: 400 }
      );
    }

    // Buscar o usuário no Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Erro ao buscar usuários auth:', authError);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }

    const authUser = authUsers.users.find(user => user.email === validatedData.email);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado no sistema de autenticação' },
        { status: 404 }
      );
    }

    // Atualizar senha do usuário no Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authUser.id,
      { password: validatedData.password }
    );

    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError);
      return NextResponse.json(
        { error: 'Erro ao definir senha' },
        { status: 500 }
      );
    }

    // Atualizar provedor na tabela users para incluir email
    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        provedor: `${existingUser.provedor},email`,
        dados_sociais: {
          ...existingUser.dados_sociais,
          linked_providers: [existingUser.provedor, 'email'],
          password_set_at: new Date().toISOString()
        }
      })
      .eq('id', existingUser.id);

    if (updateUserError) {
      console.error('Erro ao atualizar usuário:', updateUserError);
      return NextResponse.json(
        { error: 'Erro ao atualizar perfil' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Senha definida com sucesso! Agora pode usar email e senha para fazer login.',
      user: {
        id: existingUser.id,
        email: existingUser.email,
        provedor: `${existingUser.provedor},email`
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Erro ao definir senha:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
