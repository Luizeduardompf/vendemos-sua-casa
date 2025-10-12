import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  textColorClass?: string;
}

export function Logo({ size = 'md', showText = true, className, textColorClass = 'text-gray-900' }: LogoProps) {
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
        'rounded-lg flex items-center justify-center relative overflow-hidden',
        sizeClasses[size]
      )}>
        {/* Logo exata da imagem fornecida */}
        <img 
          src="/logo-handshake-house.svg" 
          alt="Vendemos Sua Casa Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      {showText && (
        <span className={cn('font-bold', textSizeClasses[size], textColorClass)}>
          Vendemos Sua Casa
        </span>
      )}
    </div>
  );
}
