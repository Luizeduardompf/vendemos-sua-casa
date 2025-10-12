import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14'
  };

  const textSizeClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-lg lg:text-xl',
    lg: 'text-lg sm:text-xl lg:text-2xl'
  };

  return (
    <div className={cn('flex items-center space-x-2 sm:space-x-3', className)}>
      <div className={cn(
        'bg-gradient-to-br from-amber-300 to-amber-600 rounded-lg flex items-center justify-center relative overflow-hidden',
        sizeClasses[size]
      )}>
        {/* Casa com aperto de mãos em forma de coração - EXATO da imagem */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Telhado da casa (triângulo) */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[14px] border-r-[14px] border-b-[16px] border-l-transparent border-r-transparent border-b-amber-800"></div>
          
          {/* Corpo da casa */}
          <div className="w-8 h-7 bg-amber-800 rounded-sm relative">
            {/* Aperto de mãos em forma de coração - EXATO da imagem */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Mão direita (superior) - polegar e indicador */}
              <div className="absolute top-2 right-2 w-1.5 h-3 bg-amber-900 rounded-full transform rotate-20"></div>
              <div className="absolute top-3 right-1 w-1.5 h-3 bg-amber-900 rounded-full transform rotate-50"></div>
              
              {/* Mão esquerda (inferior) - quatro dedos */}
              <div className="absolute bottom-2 left-2 w-1.5 h-3 bg-amber-900 rounded-full transform -rotate-20"></div>
              <div className="absolute bottom-3 left-1 w-1.5 h-3 bg-amber-900 rounded-full transform -rotate-50"></div>
              <div className="absolute bottom-2 left-3 w-1.5 h-3 bg-amber-900 rounded-full transform -rotate-35"></div>
              <div className="absolute bottom-3 left-4 w-1.5 h-3 bg-amber-900 rounded-full transform -rotate-65"></div>
              
              {/* Conexão central (formando coração) */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-900 rounded-full"></div>
              
              {/* Forma do coração criada pelo aperto de mãos */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-amber-900"></div>
            </div>
          </div>
        </div>
      </div>
      {showText && (
        <span className={cn('font-bold text-gray-900', textSizeClasses[size])}>
          Vendemos Sua Casa
        </span>
      )}
    </div>
  );
}
