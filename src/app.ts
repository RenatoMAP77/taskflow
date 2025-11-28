/**
 * TaskFlow - Configuração da Aplicação Express
 * 
 * Este arquivo configura e exporta a aplicação Express.
 * Configura middlewares, rotas e tratamento de erros.
 * 
 * @module app
 * @author Equipe TaskFlow - PUC Minas
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config, isTest } from './config';
import { swaggerSpec } from './config/swagger';
import { createTaskRoutes } from './routes/taskRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { TaskController } from './controllers/TaskController';

/**
 * Cria e configura a aplicação Express
 * 
 * @param {TaskController} controller - Controlador de tarefas (opcional, para injeção de dependência)
 * @returns {Application} Aplicação Express configurada
 */
export function createApp(controller?: TaskController): Application {
  const app: Application = express();

  // ============================================
  // Middlewares de Segurança e Parsing
  // ============================================
  
  // Helmet - adiciona headers de segurança
  app.use(helmet());
  
  // CORS - permite requisições cross-origin
  app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // Parser de JSON
  app.use(express.json());
  
  // Parser de URL encoded
  app.use(express.urlencoded({ extended: true }));
  
  // Morgan - logging de requisições (desabilitado em testes)
  if (!isTest()) {
    app.use(morgan(config.logLevel));
  }

  // ============================================
  // Rotas da API
  // ============================================
  
  /**
   * @route GET /
   * @description Rota raiz - informações da API
   */
  app.get('/', (req, res) => {
    res.json({
      name: 'TaskFlow API',
      version: '1.0.0',
      description: 'API de gerenciamento de tarefas',
      author: 'Equipe TaskFlow - PUC Minas',
      endpoints: {
        tasks: `${config.apiPrefix}/tasks`,
        health: '/health'
      }
    });
  });

  /**
   * @route GET /health
   * @description Health check - verifica se a API está funcionando
   */
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // ============================================
  // Swagger/OpenAPI Documentation
  // ============================================
  
  /**
   * @route GET /docs
   * @description Interface interativa do Swagger
   */
  app.use('/docs', swaggerUi.serve);
  app.get('/docs', swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true,
      showExtensions: true
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TaskFlow API - Documentação'
  }));

  /**
   * @route GET /docs.json
   * @description Especificação OpenAPI em formato JSON
   */
  app.get('/docs.json', (req, res) => {
    res.json(swaggerSpec);
  });

  // Rotas de tarefas
  app.use(`${config.apiPrefix}/tasks`, createTaskRoutes(controller));

  // ============================================
  // Tratamento de Erros
  // ============================================
  
  // Rota não encontrada
  app.use(notFoundHandler);
  
  // Handler de erros global
  app.use(errorHandler);

  return app;
}

/**
 * Aplicação Express padrão
 */
export const app = createApp();
