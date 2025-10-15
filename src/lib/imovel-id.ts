/**
 * Gera um ID único para imóveis no formato: 3 letras + hífen + 3 números
 * Exemplo: ABC-123, XYZ-789, DEF-456
 */

export function generateImovelId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let result = '';
  
  // Gerar 3 letras maiúsculas
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Adicionar hífen
  result += '-';
  
  // Gerar 3 números
  for (let i = 0; i < 3; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return result;
}

/**
 * Valida se um ID de imóvel está no formato correto
 */
export function isValidImovelId(id: string): boolean {
  const pattern = /^[A-Z]{3}-[0-9]{3}$/;
  return pattern.test(id);
}

/**
 * Gera um ID único verificando se já existe no banco
 */
export async function generateUniqueImovelId(supabase: any): Promise<string> {
  let id: string;
  let exists = true;
  
  while (exists) {
    id = generateImovelId();
    
    // Verificar se o ID já existe
    const { data, error } = await supabase
      .from('imoveis')
      .select('id')
      .eq('imovel_id', id)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // ID não existe, podemos usar
      exists = false;
    } else if (data) {
      // ID existe, tentar novamente
      exists = true;
    } else {
      // Outro erro
      console.error('Erro ao verificar ID único:', error);
      exists = false;
    }
  }
  
  return id!;
}
