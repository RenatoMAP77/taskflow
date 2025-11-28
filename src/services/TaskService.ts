/**
 * TaskFlow - Serviço de Tarefas
 * 
 * Contém a lógica de negócio para operações com tarefas.
 * Implementa validações e regras de negócio.
 * 
 * @module services/TaskService
 */

import { Task, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from '../models/Task';
import { ITaskRepository } from '../repositories/ITaskRepository';

/**
 * Interface para estatísticas de tarefas
 */
export interface TaskStatistics {
  total: number;
  pending: number;
  inProgress: number;
  done: number;
  completionRate: number;
}

/**
 * Erro personalizado para operações com tarefas
 */
export class TaskError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number = 400) {
    super(message);
    this.name = 'TaskError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Serviço responsável pela lógica de negócio de tarefas
 * 
 * @class TaskService
 */
export class TaskService {
  private repository: ITaskRepository;

  /**
   * Cria uma nova instância do serviço
   * 
   * @param {ITaskRepository} repository - Repositório de tarefas
   */
  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  /**
   * Cria uma nova tarefa com validações
   * 
   * @param {CreateTaskDTO} data - Dados para criação
   * @returns {Promise<Task>} A tarefa criada
   * @throws {TaskError} Se os dados forem inválidos
   */
  public async createTask(data: CreateTaskDTO): Promise<Task> {
    this.validateCreateData(data);
    const task = await this.repository.create(data);
    return task;
  }

  /**
   * Busca todas as tarefas
   * 
   * @returns {Promise<Task[]>} Lista de todas as tarefas
   */
  public async getAllTasks(): Promise<Task[]> {
    return this.repository.findAll();
  }

  /**
   * Busca uma tarefa pelo ID
   * 
   * @param {string} id - ID da tarefa
   * @returns {Promise<Task>} A tarefa encontrada
   * @throws {TaskError} Se a tarefa não for encontrada
   */
  public async getTaskById(id: string): Promise<Task> {
    this.validateId(id);
    const task = await this.repository.findById(id);
    if (!task) {
      throw new TaskError('Tarefa não encontrada', 'TASK_NOT_FOUND', 404);
    }
    return task;
  }

  /**
   * Busca tarefas por status
   * 
   * @param {TaskStatus} status - Status para filtrar
   * @returns {Promise<Task[]>} Lista de tarefas com o status especificado
   */
  public async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    this.validateStatus(status);
    return this.repository.findByStatus(status);
  }

  /**
   * Atualiza uma tarefa existente
   * 
   * @param {string} id - ID da tarefa
   * @param {UpdateTaskDTO} data - Dados para atualização
   * @returns {Promise<Task>} A tarefa atualizada
   * @throws {TaskError} Se a tarefa não for encontrada ou dados inválidos
   */
  public async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    this.validateId(id);
    this.validateUpdateData(data);
    
    const task = await this.repository.update(id, data);
    if (!task) {
      throw new TaskError('Tarefa não encontrada', 'TASK_NOT_FOUND', 404);
    }
    return task;
  }

  /**
   * Remove uma tarefa
   * 
   * @param {string} id - ID da tarefa
   * @returns {Promise<void>}
   * @throws {TaskError} Se a tarefa não for encontrada
   */
  public async deleteTask(id: string): Promise<void> {
    this.validateId(id);
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new TaskError('Tarefa não encontrada', 'TASK_NOT_FOUND', 404);
    }
  }

  /**
   * Marca uma tarefa como concluída
   * 
   * @param {string} id - ID da tarefa
   * @returns {Promise<Task>} A tarefa atualizada
   * @throws {TaskError} Se a tarefa não for encontrada
   */
  public async markTaskAsDone(id: string): Promise<Task> {
    return this.updateTask(id, { status: TaskStatus.DONE });
  }

  /**
   * Marca uma tarefa como em progresso
   * 
   * @param {string} id - ID da tarefa
   * @returns {Promise<Task>} A tarefa atualizada
   * @throws {TaskError} Se a tarefa não for encontrada
   */
  public async markTaskAsInProgress(id: string): Promise<Task> {
    return this.updateTask(id, { status: TaskStatus.IN_PROGRESS });
  }

  /**
   * Marca uma tarefa como pendente
   * 
   * @param {string} id - ID da tarefa
   * @returns {Promise<Task>} A tarefa atualizada
   * @throws {TaskError} Se a tarefa não for encontrada
   */
  public async markTaskAsPending(id: string): Promise<Task> {
    return this.updateTask(id, { status: TaskStatus.PENDING });
  }

  /**
   * Obtém estatísticas das tarefas
   * 
   * @returns {Promise<TaskStatistics>} Estatísticas das tarefas
   */
  public async getStatistics(): Promise<TaskStatistics> {
    const total = await this.repository.count();
    const pending = await this.repository.countByStatus(TaskStatus.PENDING);
    const inProgress = await this.repository.countByStatus(TaskStatus.IN_PROGRESS);
    const done = await this.repository.countByStatus(TaskStatus.DONE);
    
    const completionRate = total > 0 ? (done / total) * 100 : 0;

    return {
      total,
      pending,
      inProgress,
      done,
      completionRate: Math.round(completionRate * 100) / 100
    };
  }

  /**
   * Valida os dados de criação de tarefa
   * 
   * @private
   * @param {CreateTaskDTO} data - Dados para validar
   * @throws {TaskError} Se os dados forem inválidos
   */
  private validateCreateData(data: CreateTaskDTO): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new TaskError('O título é obrigatório', 'INVALID_TITLE', 400);
    }
    if (data.title.length > 200) {
      throw new TaskError('O título deve ter no máximo 200 caracteres', 'TITLE_TOO_LONG', 400);
    }
    if (!data.description || data.description.trim().length === 0) {
      throw new TaskError('A descrição é obrigatória', 'INVALID_DESCRIPTION', 400);
    }
    if (data.description.length > 2000) {
      throw new TaskError('A descrição deve ter no máximo 2000 caracteres', 'DESCRIPTION_TOO_LONG', 400);
    }
    if (data.status && !this.isValidStatus(data.status)) {
      throw new TaskError('Status inválido', 'INVALID_STATUS', 400);
    }
  }

  /**
   * Valida os dados de atualização de tarefa
   * 
   * @private
   * @param {UpdateTaskDTO} data - Dados para validar
   * @throws {TaskError} Se os dados forem inválidos
   */
  private validateUpdateData(data: UpdateTaskDTO): void {
    if (data.title !== undefined && data.title.trim().length === 0) {
      throw new TaskError('O título não pode ser vazio', 'INVALID_TITLE', 400);
    }
    if (data.title && data.title.length > 200) {
      throw new TaskError('O título deve ter no máximo 200 caracteres', 'TITLE_TOO_LONG', 400);
    }
    if (data.description !== undefined && data.description.trim().length === 0) {
      throw new TaskError('A descrição não pode ser vazia', 'INVALID_DESCRIPTION', 400);
    }
    if (data.description && data.description.length > 2000) {
      throw new TaskError('A descrição deve ter no máximo 2000 caracteres', 'DESCRIPTION_TOO_LONG', 400);
    }
    if (data.status && !this.isValidStatus(data.status)) {
      throw new TaskError('Status inválido', 'INVALID_STATUS', 400);
    }
  }

  /**
   * Valida um ID de tarefa
   * 
   * @private
   * @param {string} id - ID para validar
   * @throws {TaskError} Se o ID for inválido
   */
  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new TaskError('ID da tarefa é obrigatório', 'INVALID_ID', 400);
    }
  }

  /**
   * Valida um status de tarefa
   * 
   * @private
   * @param {TaskStatus} status - Status para validar
   * @throws {TaskError} Se o status for inválido
   */
  private validateStatus(status: TaskStatus): void {
    if (!this.isValidStatus(status)) {
      throw new TaskError('Status inválido', 'INVALID_STATUS', 400);
    }
  }

  /**
   * Verifica se um status é válido
   * 
   * @private
   * @param {TaskStatus} status - Status para verificar
   * @returns {boolean} True se válido
   */
  private isValidStatus(status: TaskStatus): boolean {
    return Object.values(TaskStatus).includes(status);
  }
}
