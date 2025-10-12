'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
    aceitaTermos: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>('proprietario');
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type && ['proprietario', 'agente', 'imobiliaria'].includes(type)) {
      setUserType(type);
    }
  }, [searchParams]);

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'agente': return 'Agente';
      case 'imobiliaria': return 'Imobiliária';
      default: return 'Proprietário';
    }
  };

  // Funções de validação
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateNIF = (nif: string): boolean => {
    // Validação de NIF português
    if (!/^\d{9}$/.test(nif)) return false;
    
    const checkDigit = parseInt(nif[8]);
    let sum = 0;
    
    for (let i = 0; i < 8; i++) {
      sum += parseInt(nif[i]) * (9 - i);
    }
    
    const remainder = sum % 11;
    const expectedCheckDigit = remainder < 2 ? remainder : 11 - remainder;
    
    return checkDigit === expectedCheckDigit;
  };

  const validateNomeCompleto = (nome: string): boolean => {
    // Nome deve ter pelo menos 2 palavras e cada palavra pelo menos 2 caracteres
    const palavras = nome.trim().split(/\s+/);
    return palavras.length >= 2 && palavras.every(palavra => palavra.length >= 2);
  };

  const validatePassword = (password: string): boolean => {
    // Mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validações
    if (!validateNomeCompleto(formData.nome)) {
      setError('Nome completo deve ter pelo menos 2 palavras com 2 caracteres cada.');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Email inválido. Por favor, insira um email válido.');
      setIsLoading(false);
      return;
    }

    if (!validateNIF(formData.nif)) {
      setError('NIF inválido. Por favor, insira um NIF português válido.');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Palavra-passe deve ter pelo menos 8 caracteres, incluindo 1 maiúscula, 1 minúscula e 1 número.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As palavras-passe não coincidem.');
      setIsLoading(false);
      return;
    }

    if (!formData.aceitaTermos) {
      setError('Deve aceitar os Termos e Privacidade.');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implementar registo com Supabase
      console.log('Registo:', { ...formData, userType });
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err) {
      setError('Ocorreu um erro no registo. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Criar conta de {getUserTypeLabel(userType).toLowerCase()}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Registe-se para aceder ao portal
          </p>
          <div className="mt-2">
            <Link
              href="/auth/select-type"
              className="text-xs text-primary hover:text-primary/80 underline"
            >
              ← Alterar tipo de utilizador
            </Link>
          </div>
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
            {/* Social Login primeiro */}
            <SocialLogin mode="register" userType={userType} />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Ou continue com email
                </span>
              </div>
            </div>

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
                  placeholder="Ex: João Silva"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                  className="h-11"
                />
                <p className="text-xs text-gray-500">Mínimo 2 palavras com 2 caracteres cada</p>
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
                <p className="text-xs text-gray-500">Formato: nome@dominio.com</p>
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
                  maxLength={9}
                  className="h-11"
                />
                <p className="text-xs text-gray-500">9 dígitos (ex: 123456789)</p>
              </div>

              {userType === 'proprietario' && (
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
              )}

              {userType === 'agente' && (
                <div className="space-y-2">
                  <Label htmlFor="ami">Número AMI *</Label>
                  <Input
                    id="ami"
                    type="text"
                    placeholder="12345"
                    className="h-11"
                    required
                  />
                </div>
              )}

              {userType === 'imobiliaria' && (
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
                  <Input
                    id="nomeEmpresa"
                    type="text"
                    placeholder="Nome da sua imobiliária"
                    className="h-11"
                    required
                  />
                </div>
              )}

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
                <p className="text-xs text-gray-500">8+ caracteres, 1 maiúscula, 1 minúscula, 1 número</p>
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
                <Label htmlFor="aceitaTermos" className="text-xs sm:text-sm text-gray-600">
                  Aceito os{' '}
                  <Link href="/termos" className="text-primary hover:text-primary/80 underline">
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link href="/privacidade" className="text-primary hover:text-primary/80 underline">
                    Privacidade.
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

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  href={`/auth/login?type=${userType}`}
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