import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
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

    // Verificar se já tem senha definida
    if (existingUser.provedor && existingUser.provedor.includes('email')) {
      return NextResponse.json(
        { error: 'Esta conta já possui senha definida' },
        { status: 400 }
      );
    }

    // Usar admin API para atualizar senha
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Erro ao listar usuários:', listError);
      return NextResponse.json(
        { error: 'Erro ao verificar usuário no sistema de autenticação' },
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

    // Atualizar senha usando admin API
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
    const newProvedor = existingUser.provedor ? `${existingUser.provedor},email` : 'email';
    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        provedor: newProvedor,
        dados_sociais: {
          ...existingUser.dados_sociais,
          linked_providers: existingUser.dados_sociais?.linked_providers 
            ? [...existingUser.dados_sociais.linked_providers, 'email']
            : [existingUser.provedor || 'google', 'email'],
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
        provedor: newProvedor
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
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