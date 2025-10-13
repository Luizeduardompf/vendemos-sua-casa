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
  aceita_marketing: z.boolean().optional().default(false),
  // Novos campos do Google
  foto_perfil: z.string().optional(),
  primeiro_nome: z.string().optional(),
  ultimo_nome: z.string().optional(),
  nome_exibicao: z.string().optional(),
  provedor: z.string().optional(),
  provedor_id: z.string().optional(),
  localizacao: z.string().optional(),
  email_verificado: z.boolean().optional(),
  foto_manual: z.boolean().optional(),
  dados_sociais: z.any().optional()
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
    
    // Verificar se o email já existe na tabela users
    console.log('🔵 Verificando se email já existe:', validatedData.email);
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id, auth_user_id, email, user_type')
      .eq('email', validatedData.email)
      .single();
    
    console.log('🔵 Resultado da verificação de usuário existente:');
    console.log('🔵 Existing User:', existingUser);
    console.log('🔵 Existing User Error:', existingUserError);
    
    if (existingUser) {
      console.log('🔵 Usuário já existe na tabela users:', existingUser);
      return NextResponse.json(
        { 
          success: true,
          message: 'Utilizador já registado',
          user: {
            id: existingUser.id,
            email: validatedData.email,
            nome_completo: validatedData.nome_completo,
            user_type: validatedData.user_type,
            is_verified: true
          }
        },
        { status: 200 }
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
    
    // Verificar se o usuário já existe no Supabase Auth
    console.log('🔵 Verificando se usuário existe no Supabase Auth...');
    const { data: existingAuthUser, error: authUserError } = await supabase.auth.getUser();
    
    console.log('🔵 Auth User Check:');
    console.log('🔵 Existing Auth User:', existingAuthUser);
    console.log('🔵 Auth User Error:', authUserError);
    
    let authData, authError;
    
    if (existingAuthUser.user && existingAuthUser.user.email === validatedData.email) {
      console.log('🔵 Usuário já existe no Auth, usando dados existentes');
      authData = { user: existingAuthUser.user };
      authError = null;
    } else {
      // Criar utilizador no Supabase Auth
      console.log('🔵 Criando utilizador no Supabase Auth...');
      console.log('🔵 Email:', validatedData.email);
      console.log('🔵 Password length:', validatedData.password.length);
      console.log('🔵 User type:', validatedData.user_type);
      
      const authResult = await supabase.auth.signUp({
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
      
      authData = authResult.data;
      authError = authResult.error;
    }
    
    console.log('🔵 Auth Data:', authData);
    console.log('🔵 Auth Error:', authError);
    
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
    console.log('🔵 Criando perfil na tabela users...');
    console.log('🔵 Auth User ID:', authData.user.id);
    console.log('🔵 Email:', validatedData.email);
    console.log('🔵 Nome:', validatedData.nome_completo);
    
    const insertData = {
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
        is_active: true,
        // Campos de verificação
        email_verificado: false, // Email sempre pendente no início (precisa confirmar)
        telefone_verificado: false, // Telefone sempre pendente no início
        conta_analisada: false, // Conta sempre pendente de análise
        status_analise: 'pending', // Todas as contas iniciam como pendentes
        // Novos campos do Google
        foto_perfil: validatedData.foto_perfil,
        primeiro_nome: validatedData.primeiro_nome,
        ultimo_nome: validatedData.ultimo_nome,
        nome_exibicao: validatedData.nome_exibicao,
        provedor: validatedData.provedor,
        provedor_id: validatedData.provedor_id,
        localizacao: validatedData.localizacao,
        email_verificado: validatedData.email_verificado,
        foto_manual: validatedData.foto_manual,
        dados_sociais: validatedData.dados_sociais
      };
    
    console.log('🔵 Dados para inserir:', insertData);
    
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert(insertData)
      .select()
      .single();
    
    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      console.error('❌ Detalhes do erro:', {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      });
      
      // Tentar remover o utilizador do Auth se falhou a criar o perfil
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
        console.log('✅ Utilizador removido do Auth após erro');
      } catch (deleteError) {
        console.error('❌ Erro ao remover utilizador do Auth:', deleteError);
      }
      
      return NextResponse.json(
        { 
          error: 'Erro ao criar perfil do utilizador',
          details: profileError.message,
          code: profileError.code
        },
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
