import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Buscar um usuário específico para testar
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'luanavlyra@gmail.com')
      .single();
    
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }
    
    console.log('🔍 Usuário encontrado:', user);
    console.log('🔍 Foto do perfil:', user.foto_perfil);
    console.log('🔍 Nome completo:', user.nome_completo);
    console.log('🔍 Nome exibição:', user.nome_exibicao);
    
    // Verificar se a URL da foto é válida
    const fotoValida = user.foto_perfil && user.foto_perfil.trim() !== '';
    console.log('🔍 Foto válida?', fotoValida);
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nome_completo: user.nome_completo,
        nome_exibicao: user.nome_exibicao,
        foto_perfil: user.foto_perfil,
        foto_valida: fotoValida
      }
    });
    
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
