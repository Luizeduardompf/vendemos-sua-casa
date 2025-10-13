'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  hasPassword: boolean;
  onSuccess?: () => void;
}

export default function PasswordModal({ 
  isOpen, 
  onClose, 
  userEmail, 
  hasPassword,
  onSuccess 
}: PasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validações básicas
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          password: newPassword,
          confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(hasPassword ? 'Senha alterada com sucesso!' : 'Senha definida com sucesso!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        if (onSuccess) {
          onSuccess();
        }
        
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.error || 'Erro ao definir senha');
      }
    } catch (error) {
      console.error('Erro ao definir senha:', error);
      setError('Erro ao definir senha');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {hasPassword ? 'Alterar Senha' : 'Definir Senha'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                value={userEmail}
                disabled
                className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
            </div>

            {error && (
              <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                  {hasPassword ? 'Nova Senha *' : 'Senha *'}
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                  Confirmar Senha *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Salvando...' : (hasPassword ? 'Alterar Senha' : 'Definir Senha')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>💡 <strong>Dica:</strong> Com uma senha definida, você poderá:</p>
              <ul className="mt-1 ml-4 list-disc">
                <li>Fazer login com email e senha</li>
                <li>Continuar usando o login social</li>
                <li>Ter mais flexibilidade de acesso</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
