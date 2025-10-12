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
        'bg-amber-600 rounded-lg flex items-center justify-center relative overflow-hidden',
        sizeClasses[size]
      )}>
        {/* Casa estilizada com V integrado */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Telhado da casa (triângulo branco) */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-white"></div>
          {/* Corpo da casa (retângulo branco com cantos arredondados) */}
          <div className="w-5 h-4 bg-white rounded-sm"></div>
          {/* V estilizado integrado na casa */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-amber-800 font-black text-lg sm:text-xl" style={{ fontFamily: 'Arial, sans-serif' }}>V</span>
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
