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
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">V</span>
              </div>
              <span className="text-sm sm:text-xl font-bold text-gray-900 hidden xs:block">VENDEMOSSUACASA.PT</span>
              <span className="text-sm sm:text-xl font-bold text-gray-900 xs:hidden">VSC</span>
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

          {/* Mobile menu button */}
          <div className="md:hidden ml-2">
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
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="space-y-2">
                  <Link href="/auth/login" className="block">
                    <Button variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      VENDER
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}