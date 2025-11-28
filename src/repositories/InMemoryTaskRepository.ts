/**
 * TaskFlow - Implementação In-Memory do Repositório de Tarefas
 * 
 * Esta implementação armazena as tarefas em memória usando um Map.
 * Ideal para desenvolvimento, testes e demonstrações.
 * 
 * @module repositories/InMemoryTaskRepository
 * @author Equipe TaskFlow - PUC Minas
 */

import { Task, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from '../models/Task';
import { ITaskRepository } from './ITaskRepository';

/**
 * Implementação do repositório de tarefas em memória
 * 
 * @class InMemoryTaskRepository
 * @implements {ITaskRepository}
 */
export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task>;

  /**
   * Cria uma nova instância do repositório in-memory
   */
  constructor() {
    this.tasks = new Map<string, Task>();
  }

  /**
   * Cria uma nova tarefa no repositório
   * 
   * @param {CreateTaskDTO} data - Dados para criação da tarefa
   * @returns {Promise<Task>} A tarefa criada
   */
  public async create(data: CreateTaskDTO): Promise<Task> {
    const task = new Task(data);
    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Busca todas as tarefas do repositório
   * 
   * @returns {Promise<Task[]>} Lista de todas as tarefas
   */
  public async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  /**
   * Busca uma tarefa pelo seu ID
   * 
   * @param {string} id - ID da tarefa
   * @returns {Promise<Task | null>} A tarefa encontrada ou null
   */
  public async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }

  /**
   * Busca tarefas por status
   * 
   * @param {TaskStatus} status - Status para filtrar
   * @returns {Promise<Task[]>} Lista de tarefas com o status especificado
   */
  public async findByStatus(status: TaskStatus): Promise<Task[]> {
    const allTasks = await this.findAll();
    return allTasks.filter(task => task.status === status);
  }

  /**
   * Atualiza uma tarefa existente
   * 
   * @param {string} id - ID da tarefa
   * @param {UpdateTaskDTO} data - Dados para atualização
   * @returns {Promise<Task | null>} A tarefa atualizada ou null se não encontrada
   */
  public async update(id: string, data: UpdateTaskDTO): Promise<Task | null> {
    const task = await this.findById(id);
    if (!task) {
      return null;
    }
    task.update(data);
    this.tasks.set(id, task);
    return task;
  }

  /**
   * Remove uma tarefa do repositório
   * 
   * @param {string} id - ID da tarefa
   * @returns {Promise<boolean>} True se removida, false se não encontrada
   */
  public async delete(id: string): Promise<boolean> {
    const exists = this.tasks.has(id);
    if (exists) {
      this.tasks.delete(id);
    }
    return exists;
  }

  /**
   * Conta o total de tarefas no repositório
   * 
   * @returns {Promise<number>} Número total de tarefas
   */
  public async count(): Promise<number> {
    return this.tasks.size;
  }

  /**
   * Conta tarefas por status
   * 
   * @param {TaskStatus} status - Status para contar
   * @returns {Promise<number>} Número de tarefas com o status especificado
   */
  public async countByStatus(status: TaskStatus): Promise<number> {
    const tasks = await this.findByStatus(status);
    return tasks.length;
  }

  /**
   * Limpa todos os dados do repositório
   * 
   * @returns {Promise<void>}
   */
  public async clear(): Promise<void> {
    this.tasks.clear();
  }

  /**
   * Verifica se uma tarefa existe pelo ID
   * 
   * @param {string} id - ID da tarefa
   * @returns {Promise<boolean>} True se existe, false caso contrário
   */
  public async exists(id: string): Promise<boolean> {
    return this.tasks.has(id);
  }

  /**
   * Busca tarefas criadas em um período específico
   * 
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Promise<Task[]>} Lista de tarefas no período
   */
  public async findByDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
    const allTasks = await this.findAll();
    return allTasks.filter(task => 
      task.createdAt >= startDate && task.createdAt <= endDate
    );
  }

  /**
   * Busca tarefas pelo título (busca parcial, case-insensitive)
   * 
   * @param {string} title - Termo de busca
   * @returns {Promise<Task[]>} Lista de tarefas que contêm o termo no título
   */
  public async findByTitle(title: string): Promise<Task[]> {
    const allTasks = await this.findAll();
    const searchTerm = title.toLowerCase();
    return allTasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm)
    );
  }
}
