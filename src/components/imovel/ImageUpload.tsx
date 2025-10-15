'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  imovelId: string;
  onUploadSuccess?: () => void;
}

export function ImageUpload({ imovelId, onUploadSuccess }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'geral',
    principal: false
  });

  const categorias = [
    { value: 'exterior', label: 'Exterior' },
    { value: 'interior', label: 'Interior' },
    { value: 'cozinha', label: 'Cozinha' },
    { value: 'quarto', label: 'Quarto' },
    { value: 'casa-de-banho', label: 'Casa de Banho' },
    { value: 'varanda', label: 'Varanda' },
    { value: 'garagem', label: 'Garagem' },
    { value: 'jardim', label: 'Jardim' },
    { value: 'geral', label: 'Geral' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF.');
        setUploadStatus('error');
        return;
      }

      // Validar tamanho (máximo 3MB)
      const maxSize = 3 * 1024 * 1024; // 3MB
      if (file.size > maxSize) {
        setErrorMessage('Arquivo muito grande. Máximo 3MB.');
        setUploadStatus('error');
        return;
      }

      // Gerar título automático se não fornecido
      if (!formData.titulo) {
        setFormData(prev => ({
          ...prev,
          titulo: file.name.split('.')[0]
        }));
      }

      setUploadStatus('idle');
      setErrorMessage('');
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setErrorMessage('Selecione um arquivo para upload.');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('categoria', formData.categoria);
      formDataToSend.append('principal', formData.principal.toString());

      const response = await fetch(`/api/imovel/${imovelId}/upload-image`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus('success');
        setFormData({
          titulo: '',
          descricao: '',
          categoria: 'geral',
          principal: false
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onUploadSuccess?.();
      } else {
        setErrorMessage(result.error || 'Erro ao fazer upload da imagem.');
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setErrorMessage('Erro de conexão. Tente novamente.');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Upload de Imagem</h3>
        </div>

        {/* Seleção de arquivo */}
        <div className="space-y-2">
          <Label htmlFor="file">Arquivo de Imagem</Label>
          <Input
            ref={fileInputRef}
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
          <p className="text-sm text-gray-500">
            Formatos aceitos: JPEG, PNG, WebP, GIF. Máximo 3MB.
          </p>
        </div>

        {/* Título */}
        <div className="space-y-2">
          <Label htmlFor="titulo">Título da Imagem</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            placeholder="Ex: Cozinha Principal"
          />
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
            placeholder="Ex: Cozinha espaçosa com muita luz natural"
            rows={3}
          />
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
          <Select
            value={formData.categoria}
            onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria.value} value={categoria.value}>
                  {categoria.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Imagem Principal */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="principal"
            checked={formData.principal}
            onChange={(e) => setFormData(prev => ({ ...prev, principal: e.target.checked }))}
            className="rounded"
          />
          <Label htmlFor="principal">Definir como imagem principal</Label>
        </div>

        {/* Status */}
        {uploadStatus === 'success' && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Imagem enviada com sucesso!</span>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        {/* Botão de Upload */}
        <Button
          onClick={handleUpload}
          disabled={isUploading || !fileInputRef.current?.files?.[0]}
          className="w-full"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Enviar Imagem
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
