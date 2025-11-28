/**
 * TaskFlow - Configurações do Sistema
 * 
 * Centraliza todas as configurações da aplicação.
 * Usa variáveis de ambiente quando disponíveis.
 * 
 * @module config
 * @author Equipe TaskFlow - PUC Minas
 */

/**
 * Interface de configuração da aplicação
 */
export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  corsOrigin: string;
  logLevel: string;
}

/**
 * Obtém a configuração da aplicação a partir das variáveis de ambiente
 * 
 * @returns {AppConfig} Objeto de configuração
 */
export function getConfig(): AppConfig {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    logLevel: process.env.LOG_LEVEL || 'dev'
  };
}

/**
 * Verifica se está em ambiente de produção
 * 
 * @returns {boolean} True se for ambiente de produção
 */
export function isProduction(): boolean {
  return getConfig().nodeEnv === 'production';
}

/**
 * Verifica se está em ambiente de desenvolvimento
 * 
 * @returns {boolean} True se for ambiente de desenvolvimento
 */
export function isDevelopment(): boolean {
  return getConfig().nodeEnv === 'development';
}

/**
 * Verifica se está em ambiente de teste
 * 
 * @returns {boolean} True se for ambiente de teste
 */
export function isTest(): boolean {
  return getConfig().nodeEnv === 'test';
}

/**
 * Configuração padrão exportada
 */
export const config = getConfig();
