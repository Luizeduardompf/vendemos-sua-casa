'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SocialLogin } from '@/components/auth/social-login';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    nif: '',
    tipoPessoa: '',
    password: '',
    confirmPassword: '',
    aceitaTermos: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    if (!formData.aceitaTermos) {
      setError('Você deve aceitar os termos de uso.');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implementar registro com Supabase
      console.log('Registro:', formData);
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Criar conta de proprietário</h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Registe-se para angariar os seus imóveis
          </p>
        </div>

        {/* Formulário de Registro */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xl sm:text-2xl text-center">Registo</CardTitle>
            <CardDescription className="text-center text-sm">
              Preencha os dados para criar a sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="O seu nome completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="o.seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="+351 123 456 789"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nif">NIF *</Label>
                <Input
                  id="nif"
                  type="text"
                  placeholder="123456789"
                  value={formData.nif}
                  onChange={(e) => handleInputChange('nif', e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoPessoa">Tipo de Pessoa *</Label>
                <Select
                  value={formData.tipoPessoa}
                  onValueChange={(value) => handleInputChange('tipoPessoa', value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="singular">Pessoa Singular</SelectItem>
                    <SelectItem value="construtor">Construtor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Palavra-passe *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  minLength={8}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Palavra-passe *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme a sua palavra-passe"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="flex items-start space-x-2">
                <input
                  id="aceitaTermos"
                  type="checkbox"
                  checked={formData.aceitaTermos}
                  onChange={(e) => handleInputChange('aceitaTermos', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                />
                <Label htmlFor="aceitaTermos" className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Aceito os{' '}
                  <Link href="/termos" className="text-primary hover:text-primary/80 underline">
                    Termos de Utilização
                  </Link>{' '}
                  e{' '}
                  <Link href="/privacidade" className="text-primary hover:text-primary/80 underline">
                    Política de Privacidade
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'A criar conta...' : 'Criar Conta'}
              </Button>
            </form>

            <SocialLogin mode="register" />

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Faça login aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Links adicionais */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
