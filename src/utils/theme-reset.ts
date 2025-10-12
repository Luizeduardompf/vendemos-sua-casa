'use client';

/**
 * Função para resetar o tema para light e limpar configurações
 */
export function resetThemeToLight() {
  // Limpar configurações do tema
  localStorage.removeItem('user_configuracoes');
  
  // Forçar tema light no HTML
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
  
  // Limpar theme do next-themes
  localStorage.removeItem('theme');
  
  console.log('Tema resetado para light');
}

/**
 * Função para aplicar tema baseado nas configurações do utilizador
 */
export function applyUserTheme(isDarkMode: boolean) {
  if (typeof document !== 'undefined') {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }
}
