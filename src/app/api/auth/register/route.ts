import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { z } from 'zod';

// Schema de validação para registo
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Password deve ter pelo menos 8 caracteres'),
  nome_completo: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  telefone: z.string().optional(),
  user_type: z.enum(['proprietario', 'construtor', 'agente', 'imobiliaria']),
  nif: z.string().optional(),
  tipo_pessoa: z.enum(['singular', 'construtor']).optional(),
  ami: z.string().optional(),
  nome_empresa: z.string().optional(),
  ami_empresa: z.string().optional(),
  imobiliaria_id: z.string().uuid().optional(),
  morada: z.string().optional(),
  codigo_postal: z.string().optional(),
  localidade: z.string().optional(),
  distrito: z.string().optional(),
  aceita_termos: z.boolean().refine(val => val === true, 'Deve aceitar os termos'),
  aceita_privacidade: z.boolean().refine(val => val === true, 'Deve aceitar a política de privacidade'),
  aceita_marketing: z.boolean().optional().default(false)
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 API Register - Iniciando...');
    const body = await request.json();
    console.log('🔵 API Register - Body recebido:', body);
    
    // Validar dados de entrada
    const validatedData = registerSchema.parse(body);
    console.log('🔵 API Register - Dados validados:', validatedData);
    
    const supabase = createClient();
    
    // Verificar se o email já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', validatedData.email)
      .single();
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está registado' },
        { status: 400 }
      );
    }
    
    // Verificar se NIF já existe (se fornecido)
    if (validatedData.nif) {
      const { data: existingNIF } = await supabase
        .from('users')
        .select('id')
        .eq('nif', validatedData.nif)
        .single();
      
      if (existingNIF) {
        return NextResponse.json(
          { error: 'NIF já está registado' },
          { status: 400 }
        );
      }
    }
    
    // Verificar se AMI já existe (se fornecido)
    if (validatedData.ami) {
      const { data: existingAMI } = await supabase
        .from('users')
        .select('id')
        .eq('ami', validatedData.ami)
        .single();
      
      if (existingAMI) {
        return NextResponse.json(
          { error: 'AMI já está registado' },
          { status: 400 }
        );
      }
    }
    
    // Verificar se imobiliária existe (se for agente)
    if (validatedData.user_type === 'agente' && validatedData.imobiliaria_id) {
      const { data: imobiliaria } = await supabase
        .from('users')
        .select('id, user_type')
        .eq('id', validatedData.imobiliaria_id)
        .eq('user_type', 'imobiliaria')
        .single();
      
      if (!imobiliaria) {
        return NextResponse.json(
          { error: 'Imobiliária não encontrada' },
          { status: 400 }
        );
      }
    }
    
    // Criar utilizador no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.nome_completo,
          phone_number: validatedData.telefone,
          user_type: validatedData.user_type
        }
      }
    });
    
    if (authError) {
      console.error('Erro ao criar utilizador no Auth:', authError);
      
      // Mapear erros do Supabase para mensagens amigáveis
      let errorMessage = 'Erro ao criar utilizador';
      
      if (authError.message.includes('email_address_invalid')) {
        errorMessage = 'Email inválido. Por favor, use um email válido (ex: nome@gmail.com)';
      } else if (authError.message.includes('User already registered')) {
        errorMessage = 'Este email já está registado. Tente fazer login.';
      } else if (authError.message.includes('Password should be at least')) {
        errorMessage = 'Password muito fraca. Use pelo menos 8 caracteres.';
      } else if (authError.message.includes('Invalid email')) {
        errorMessage = 'Formato de email inválido.';
      } else {
        errorMessage = `Erro de autenticação: ${authError.message}`;
      }
      
      // Verificar se o utilizador já existe na tabela users
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email, user_type, is_verified')
        .eq('email', validatedData.email)
        .single();
      
      if (existingUser) {
        return NextResponse.json({
          success: true,
          message: 'Utilizador já registado. Pode fazer login.',
          user: {
            id: existingUser.id,
            email: existingUser.email,
            nome_completo: validatedData.nome_completo,
            user_type: existingUser.user_type,
            is_verified: existingUser.is_verified
          }
        });
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    
    if (!authData.user) {
      return NextResponse.json(
        { error: 'Falha ao criar utilizador' },
        { status: 500 }
      );
    }
    
    // Criar perfil na tabela users
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        auth_user_id: authData.user.id,
        email: validatedData.email,
        nome_completo: validatedData.nome_completo,
        telefone: validatedData.telefone,
        user_type: validatedData.user_type,
        nif: validatedData.nif,
        tipo_pessoa: validatedData.tipo_pessoa,
        ami: validatedData.ami,
        nome_empresa: validatedData.nome_empresa,
        ami_empresa: validatedData.ami_empresa,
        imobiliaria_id: validatedData.imobiliaria_id,
        morada: validatedData.morada,
        codigo_postal: validatedData.codigo_postal,
        localidade: validatedData.localidade,
        distrito: validatedData.distrito,
        aceita_termos: validatedData.aceita_termos,
        aceita_privacidade: validatedData.aceita_privacidade,
        aceita_marketing: validatedData.aceita_marketing,
        is_verified: false, // Pendente de verificação
        is_active: true
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('Erro ao criar perfil:', profileError);
      // Tentar remover o utilizador do Auth se falhou a criar o perfil
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Erro ao criar perfil do utilizador' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Utilizador registado com sucesso',
      user: {
        id: userProfile.id,
        email: userProfile.email,
        nome_completo: userProfile.nome_completo,
        user_type: userProfile.user_type,
        is_verified: userProfile.is_verified
      }
    });
    
  } catch (error) {
    console.error('Erro no registo:', error);
    
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
