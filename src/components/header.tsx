'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Logo />
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
            <Link href="/auth/select-type">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register?type=proprietario">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                VENDER
              </Button>
            </Link>
          </div>

          {/* Mobile buttons - sempre visíveis */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/auth/select-type">
              <Button variant="outline" size="sm" className="text-xs px-2">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/register?type=proprietario">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs px-2">
                VENDER
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 bg-gray-100 hover:bg-gray-200 border border-gray-300"
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