/**
 * TaskFlow - Middleware de Tratamento de Erros
 * 
 * Centraliza o tratamento de erros da aplicação.
 * 
 * @module middlewares/errorHandler
 * @author Equipe TaskFlow - PUC Minas
 */

import { Request, Response, NextFunction } from 'express';
import { TaskError } from '../services/TaskService';
import { isProduction } from '../config';

/**
 * Interface para resposta de erro padronizada
 */
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    stack?: string;
  };
}

/**
 * Middleware de tratamento de erros
 * 
 * @param {Error} err - Erro capturado
 * @param {Request} req - Requisição Express
 * @param {Response} res - Resposta Express
 * @param {NextFunction} next - Próximo middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  console.error(`[ERROR] ${err.message}`, err.stack);

  const response: ErrorResponse = {
    success: false,
    error: {
      message: err.message || 'Erro interno do servidor'
    }
  };

  let statusCode = 500;

  // Se for um erro do TaskFlow, usa o statusCode definido
  if (err instanceof TaskError) {
    statusCode = err.statusCode;
    response.error.code = err.code;
  }

  // Em desenvolvimento, inclui o stack trace
  if (!isProduction()) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * Middleware para rotas não encontradas
 * 
 * @param {Request} req - Requisição Express
 * @param {Response} res - Resposta Express
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
      code: 'ROUTE_NOT_FOUND'
    }
  });
}
