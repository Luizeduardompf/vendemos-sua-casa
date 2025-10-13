'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  nome_completo: string;
  user_type: string;
  is_verified: boolean;
  is_active: boolean;
  foto_perfil?: string;
  primeiro_nome?: string;
  ultimo_nome?: string;
  nome_exibicao?: string;
  provedor?: string;
  localizacao?: string;
  email_verificado?: boolean;
  dados_sociais?: any;
  foto_manual?: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserPhoto: (photoUrl: string) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const updateUserPhoto = (photoUrl: string) => {
    if (user) {
      setUser({
        ...user,
        foto_perfil: photoUrl
      });
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUserPhoto, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
