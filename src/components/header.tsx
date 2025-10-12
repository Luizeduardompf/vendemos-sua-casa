import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
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

          {/* Navigation */}
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
            <Link href="/contato" className="text-gray-700 hover:text-primary transition-colors">
              Contato
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">Entrar</span>
                <span className="sm:hidden">Login</span>
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">Cadastrar Imóvel</span>
                <span className="sm:hidden">Cadastrar</span>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-2">
            <Button variant="ghost" size="sm" className="p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
