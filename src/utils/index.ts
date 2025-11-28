/**
 * TaskFlow - Utilitários
 * 
 * Funções utilitárias usadas em toda a aplicação.
 * 
 * @module utils
 * 
 */

/**
 * Formata uma data para string ISO
 * 
 * @param {Date} date - Data para formatar
 * @returns {string} Data formatada em ISO
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Verifica se uma string é um UUID válido
 * 
 * @param {string} id - String para verificar
 * @returns {boolean} True se for um UUID válido
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Remove espaços em branco extras de uma string
 * 
 * @param {string} str - String para limpar
 * @returns {string} String limpa
 */
export function sanitizeString(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Converte a primeira letra de cada palavra para maiúscula
 * 
 * @param {string} str - String para converter
 * @returns {string} String convertida
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Gera uma resposta de sucesso padronizada
 * 
 * @param {T} data - Dados da resposta
 * @param {string} message - Mensagem opcional
 * @returns {object} Resposta formatada
 */
export function successResponse<T>(data: T, message?: string): object {
  return {
    success: true,
    message,
    data
  };
}

/**
 * Gera uma resposta de erro padronizada
 * 
 * @param {string} message - Mensagem de erro
 * @param {string} code - Código do erro
 * @returns {object} Resposta formatada
 */
export function errorResponse(message: string, code?: string): object {
  return {
    success: false,
    error: {
      message,
      code
    }
  };
}
