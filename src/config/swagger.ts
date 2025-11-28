/**
 * TaskFlow - Configuração Swagger
 * 
 * Define a configuração e especificação OpenAPI/Swagger para a API.
 * 
 * @module config/swagger
 * @author Equipe TaskFlow - PUC Minas
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

/**
 * Opções de configuração do Swagger
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API de gerenciamento de tarefas - TaskFlow (Trabalho Prático - Gerência de Configuração - PUC Minas)',
      contact: {
        name: 'Equipe TaskFlow',
        email: 'taskflow@pucminas.edu.br',
        url: 'https://pucminas.br'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}${config.apiPrefix}`,
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: `${config.apiPrefix}`,
        description: 'API Base Path'
      }
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['id', 'title', 'description', 'status', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identificador único da tarefa'
            },
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Título da tarefa'
            },
            description: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'Descrição detalhada da tarefa'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'done'],
              description: 'Status da tarefa'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora de criação da tarefa'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora da última atualização'
            }
          },
          example: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            title: 'Implementar API REST',
            description: 'Criar endpoints para gerenciamento de tarefas',
            status: 'in_progress',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T14:20:00Z'
          }
        },
        CreateTaskDTO: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Título da tarefa'
            },
            description: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'Descrição detalhada da tarefa'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'done'],
              default: 'pending',
              description: 'Status inicial da tarefa (opcional)'
            }
          },
          example: {
            title: 'Implementar API REST',
            description: 'Criar endpoints para gerenciamento de tarefas',
            status: 'pending'
          }
        },
        UpdateTaskDTO: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Novo título da tarefa'
            },
            description: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'Nova descrição da tarefa'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'done'],
              description: 'Novo status da tarefa'
            }
          },
          example: {
            title: 'Implementar API REST',
            description: 'Criar endpoints para gerenciamento de tarefas'
          }
        },
        TaskStatistics: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              description: 'Número total de tarefas'
            },
            pending: {
              type: 'integer',
              description: 'Número de tarefas pendentes'
            },
            in_progress: {
              type: 'integer',
              description: 'Número de tarefas em progresso'
            },
            done: {
              type: 'integer',
              description: 'Número de tarefas concluídas'
            },
            completionPercentage: {
              type: 'number',
              format: 'float',
              description: 'Percentual de tarefas concluídas'
            }
          },
          example: {
            total: 10,
            pending: 3,
            in_progress: 4,
            done: 3,
            completionPercentage: 30
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            statusCode: {
              type: 'integer',
              description: 'Código HTTP do erro'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora do erro'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

/**
 * Especificação OpenAPI/Swagger
 */
export const swaggerSpec = swaggerJsdoc(swaggerOptions);
