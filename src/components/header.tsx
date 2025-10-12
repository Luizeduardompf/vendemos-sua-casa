'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Casa estilizada com V */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Telhado da casa */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-white"></div>
                  {/* Corpo da casa */}
                  <div className="w-4 h-3 bg-white rounded-sm"></div>
                  {/* V estilizado */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-primary font-bold text-xs sm:text-sm">V</span>
                  </div>
                </div>
              </div>
              <span className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">Vendemos Sua Casa</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/imoveis" className="text-gray-700 hover:text-primary transition-colors">
              Imóveis
            </Link>
            <Link href="/como-funciona" className="text-gray-700 hover:text-primary transition-colors">
              Como Funciona
            </Link>
            <Link href="/comissoes" className="text-gray-700 hover:text-primary transition-colors">
              Comissões
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                VENDER
              </Button>
            </Link>
          </div>

          {/* Mobile buttons - sempre visíveis */}
          <div className="flex items-center space-x-2">
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs px-2 sm:px-3">
                VENDER
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              <Link 
                href="/imoveis" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Imóveis
              </Link>
              <Link 
                href="/como-funciona" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Como Funciona
              </Link>
              <Link 
                href="/comissoes" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Comissões
              </Link>
              <Link 
                href="/contacto" 
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              
            </div>
          </div>
        )}
      </div>
    </header>
  );
}