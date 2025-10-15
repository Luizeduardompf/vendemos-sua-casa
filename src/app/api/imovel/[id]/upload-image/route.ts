import { createClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
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

    // Verificar se o usuário é proprietário do imóvel
    const { data: imovel, error: imovelError } = await supabase
      .from('imoveis')
      .select('id, proprietario_id')
      .eq('id', imovelId)
      .single();

    if (imovelError || !imovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    if (imovel.proprietario_id !== session.user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Obter dados do arquivo
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const titulo = formData.get('titulo') as string;
    const descricao = formData.get('descricao') as string;
    const categoria = formData.get('categoria') as string;
    const principal = formData.get('principal') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não fornecido' }, { status: 400 });
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF.' 
      }, { status: 400 });
    }

    // Validar tamanho (máximo 3MB)
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'Arquivo muito grande. Máximo 3MB.' 
      }, { status: 400 });
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const filePath = `${imovelId}/${fileName}`;

    // Converter arquivo para buffer
    const fileBuffer = await file.arrayBuffer();

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imoveis-images')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      return NextResponse.json({ 
        error: 'Erro ao fazer upload da imagem' 
      }, { status: 500 });
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('imoveis-images')
      .getPublicUrl(filePath);

    // Obter próxima ordem
    const { data: maxOrder } = await supabase
      .from('imoveis_media')
      .select('ordem')
      .eq('imovel_id', imovelId)
      .order('ordem', { ascending: false })
      .limit(1)
      .single();

    const proximaOrdem = (maxOrder?.ordem || 0) + 1;

    // Inserir metadados na tabela imoveis_media
    const { data: mediaData, error: mediaError } = await supabase
      .from('imoveis_media')
      .insert({
        imovel_id: imovelId,
        url_publica: urlData.publicUrl,
        principal: principal,
        ordem: proximaOrdem,
        descricao: descricao || `Imagem ${proximaOrdem} do imóvel`,
        nome_arquivo: fileName,
        caminho_arquivo: filePath,
        tipo_media: 'foto',
        categoria: categoria || 'geral',
        ativo: true
      })
      .select()
      .single();

    if (mediaError) {
      console.error('Erro ao inserir metadados:', mediaError);
      return NextResponse.json({ 
        error: 'Erro ao salvar metadados da imagem' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Imagem enviada com sucesso!',
      data: {
        id: mediaData.id,
        url: urlData.publicUrl,
        titulo: titulo || `Imagem ${proximaOrdem}`,
        descricao: descricao || `Imagem ${proximaOrdem} do imóvel`,
        categoria: categoria || 'geral',
        principal: principal,
        ordem: proximaOrdem
      }
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}
