export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}

export function createImovelSlug(titulo: string, imovelId: string): string {
  const slug = generateSlug(titulo);
  return `${slug}-${imovelId}`;
}

export function extractIdFromSlug(slug: string): string | null {
  // Procurar por um ID de imóvel no final do slug (formato: ABC-123 ou UUID)
  const imovelIdRegex = /([A-Z]{3}-[0-9]{3})$/;
  const uuidRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
  
  // Priorizar o novo formato ABC-123
  const imovelIdMatch = slug.match(imovelIdRegex);
  if (imovelIdMatch) {
    return imovelIdMatch[1];
  }
  
  // UUID como fallback (mas será tratado como ID antigo)
  const uuidMatch = slug.match(uuidRegex);
  if (uuidMatch) {
    return uuidMatch[1];
  }
  
  return null;
}
