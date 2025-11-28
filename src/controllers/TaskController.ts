/**
 * TaskFlow - Controlador de Tarefas
 * 
 * Responsável por gerenciar as requisições HTTP relacionadas a tarefas.
 * Faz a ponte entre as rotas e o serviço de tarefas.
 * 
 * @module controllers/TaskController
 * @author Equipe TaskFlow - PUC Minas
 */

import { Request, Response, NextFunction } from 'express';
import { TaskService, TaskError } from '../services/TaskService';
import { TaskStatus } from '../models/Task';

/**
 * Controlador responsável por gerenciar requisições de tarefas
 * 
 * @class TaskController
 */
export class TaskController {
  private taskService: TaskService;

  /**
   * Cria uma nova instância do controlador
   * 
   * @param {TaskService} taskService - Serviço de tarefas
   */
  constructor(taskService: TaskService) {
    this.taskService = taskService;
  }

  /**
   * Cria uma nova tarefa
   * 
   * @route POST /tasks
   * @param {Request} req - Requisição Express
   * @param {Response} res - Resposta Express
   * @param {NextFunction} next - Próximo middleware
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, description, status } = req.body;
      const task = await this.taskService.createTask({ title, description, status });
      res.status(201).json({
        success: true,
        message: 'Tarefa criada com sucesso',
        data: task.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista todas as tarefas
   * 
   * @route GET /tasks
   * @param {Request} req - Requisição Express
   * @param {Response} res - Resposta Express
   * @param {NextFunction} next - Próximo middleware
   */
  public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks.map(task => task.toJSON())
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca uma tarefa pelo ID
   * 
   * @route GET /tasks/:id
   * @param {Request} req - Requisição Express
   * @param {Response} res - Resposta Express
   * @param {NextFunction} next - Próximo middleware
   */
  public async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id);
      res.status(200).json({
        success: true,
        data: task.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca tarefas por status
   * 
   * @route GET /tasks/status/:status
   * @param {Request} req - Requisição Express
   * @param {Response} res - Resposta Express
   * @param {NextFunction} next - Próximo middleware
   */
  public async findByStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.params;
      const tasks = await this.taskService.getTasksByStatus(status as TaskStatus);
      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks.map(task => task.toJSON())
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza uma tarefa existente
   * 
   * @route PUT /tasks/:id
   * @param {Request} req - Requisição Express
   * @param {Response} res - Resposta Express
   * @param {NextFunction} next - Próximo middleware
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;
      const task = await this.taskService.updateTask(id, { title, description, status });
      res.status(200).json({
        success: true,
        message: 'Tarefa atualizada com sucesso',
        data: task.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove uma tarefa
   * 
   * @route DELETE /tasks/:id
   * @param {Request} req - Requisição Express
   * @param {Response} res - Resposta Express
   * @param {NextFunction} next - Próximo middleware
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.taskService.deleteTask(id);
      res.status(200).json({
        success: true,
        message: 'Tarefa removida com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marca uma tarefa como concluída
   * 
   * @route PATCH /tasks/:id/done
   * @param {Request} req - Requisição Express
   * @param {Response} res - Resposta Express
   * @param {NextFunction} next - Próximo middleware
   */
  public async markAsDone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.markTaskAsDone(id);
      res.status(200).json({
        success: true,
        message: 'Tarefa marcada como concluída',
        data: task.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marca uma tarefa como em progresso
   * 
   * @route PATCH /tasks/:id/in-progress
   * @param {Request} req - Requisição Express
   * @param {Response} res - Resposta Express
   * @param {NextFunction} next - Próximo middleware
   */
  public async markAsInProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.markTaskAsInProgress(id);
      res.status(200).json({
        success: true,
        message: 'Tarefa marcada como em progresso',
        data: task.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marca uma tarefa como pendente
   * 
   * @route PATCH /tasks/:id/pending
   * @param {Request} req - Requisição Express
   * @param {Response} res - Resposta Express
   * @param {NextFunction} next - Próximo middleware
   */
  public async markAsPending(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.markTaskAsPending(id);
      res.status(200).json({
        success: true,
        message: 'Tarefa marcada como pendente',
        data: task.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém estatísticas das tarefas
   * 
   * @route GET /tasks/stats
   * @param {Request} req - Requisição Express
   * @param {Response} res - Resposta Express
   * @param {NextFunction} next - Próximo middleware
   */
  public async getStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await this.taskService.getStatistics();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}
