import { createClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient();
  const resolvedParams = await params;
  const imovelId = resolvedParams.id;

  try {
    // Verificar autenticação
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    // Obter ID da imagem a ser deletada
    const { imageId } = await request.json();

    if (!imageId) {
      return NextResponse.json({ error: 'ID da imagem não fornecido' }, { status: 400 });
    }

    // Buscar dados da imagem
    const { data: imageData, error: imageError } = await supabase
      .from('imoveis_media')
      .select(`
        id,
        imovel_id,
        caminho_arquivo,
        imoveis!inner(proprietario_id)
      `)
      .eq('id', imageId)
      .single();

    if (imageError || !imageData) {
      return NextResponse.json({ error: 'Imagem não encontrada' }, { status: 404 });
    }

    // Verificar se o usuário é proprietário do imóvel
    if (imageData.imoveis.proprietario_id !== session.user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Deletar arquivo do storage
    const { error: storageError } = await supabase.storage
      .from('imoveis-images')
      .remove([imageData.caminho_arquivo]);

    if (storageError) {
      console.error('Erro ao deletar arquivo do storage:', storageError);
      // Continuar mesmo com erro no storage
    }

    // Deletar metadados da tabela
    const { error: deleteError } = await supabase
      .from('imoveis_media')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Erro ao deletar metadados:', deleteError);
      return NextResponse.json({ 
        error: 'Erro ao deletar metadados da imagem' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Imagem deletada com sucesso!'
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

