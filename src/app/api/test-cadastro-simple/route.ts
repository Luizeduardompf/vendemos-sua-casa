import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Teste simples de cadastro...');
    
    // Verificar se há Authorization header
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Authorization header:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Authorization header não encontrado'
      });
    }
    
    const token = authHeader.substring(7);
    console.log('🔐 Token:', token.substring(0, 20) + '...');
    
    // Verificar token
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.log('❌ Erro de autenticação:', authError?.message);
      return NextResponse.json({
        success: false,
        error: 'Token inválido',
        details: authError?.message
      });
    }
    
    console.log('✅ Usuário autenticado:', user.email);
    
    // Buscar usuário na tabela (primeiro por ID, depois por email)
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, user_type, email')
      .eq('id', user.id)
      .single();
    
    // Se não encontrar por ID, tentar por email
    if (userError || !userData) {
      console.log('🔍 Buscando por email...');
      const { data: userByEmail, error: emailError } = await supabase
        .from('users')
        .select('id, user_type, email')
        .eq('email', user.email)
        .single();
      
      if (emailError || !userByEmail) {
        console.log('❌ Usuário não encontrado na tabela users');
        return NextResponse.json({
          success: false,
          error: 'Usuário não encontrado na tabela users',
          details: `ID: ${user.id}, Email: ${user.email}, Erro ID: ${userError?.message}, Erro Email: ${emailError?.message}`
        });
      }
      
      userData = userByEmail;
    }
    
    console.log('✅ Usuário encontrado na tabela:', userData);
    
    return NextResponse.json({
      success: true,
      message: 'Teste passou!',
      user: {
        id: user.id,
        email: user.email
      },
      userData: userData
    });
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
