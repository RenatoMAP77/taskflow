/**
 * TaskFlow - Servidor da Aplicação
 * 
 * Ponto de entrada da aplicação.
 * Inicia o servidor Express na porta configurada.
 * 
 * @module server
 * @author Equipe TaskFlow - PUC Minas
 */

import { app } from './app';
import { config } from './config';

/**
 * Inicia o servidor HTTP
 */
const server = app.listen(config.port, () => {
  console.log('============================================');
  console.log('         TaskFlow API - PUC Minas          ');
  console.log('============================================');
  console.log(`🚀 Servidor rodando em http://localhost:${config.port}`);
  console.log(`📝 API disponível em http://localhost:${config.port}${config.apiPrefix}`);
  console.log(`🏥 Health check em http://localhost:${config.port}/health`);
  console.log(`📚 Documentação Swagger em http://localhost:${config.port}/docs`);
  console.log(`🌍 Ambiente: ${config.nodeEnv}`);
  console.log('============================================');
});

/**
 * Tratamento de erros não capturados
 */
process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

/**
 * Graceful shutdown
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});

export { server };
