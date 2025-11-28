/**
 * TaskFlow - Interface do Repositório de Tarefas
 * 
 * Define o contrato que qualquer implementação de repositório de tarefas deve seguir.
 * Isso permite a fácil substituição de implementações (in-memory, database, etc.)
 * 
 * @module repositories/ITaskRepository
 * @author Equipe TaskFlow - PUC Minas
 */

import { Task, TaskStatus, CreateTaskDTO, UpdateTaskDTO } from '../models/Task';

/**
 * Interface que define as operações do repositório de tarefas
 * 
 * @interface ITaskRepository
 */
export interface ITaskRepository {
  /**
   * Cria uma nova tarefa no repositório
   * 
   * @param {CreateTaskDTO} data - Dados para criação da tarefa
   * @returns {Promise<Task>} A tarefa criada
   */
  create(data: CreateTaskDTO): Promise<Task>;

  /**
   * Busca todas as tarefas do repositório
   * 
   * @returns {Promise<Task[]>} Lista de todas as tarefas
   */
  findAll(): Promise<Task[]>;

  /**
   * Busca uma tarefa pelo seu ID
   * 
   * @param {string} id - ID da tarefa
   * @returns {Promise<Task | null>} A tarefa encontrada ou null
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Busca tarefas por status
   * 
   * @param {TaskStatus} status - Status para filtrar
   * @returns {Promise<Task[]>} Lista de tarefas com o status especificado
   */
  findByStatus(status: TaskStatus): Promise<Task[]>;

  /**
   * Atualiza uma tarefa existente
   * 
   * @param {string} id - ID da tarefa
   * @param {UpdateTaskDTO} data - Dados para atualização
   * @returns {Promise<Task | null>} A tarefa atualizada ou null se não encontrada
   */
  update(id: string, data: UpdateTaskDTO): Promise<Task | null>;

  /**
   * Remove uma tarefa do repositório
   * 
   * @param {string} id - ID da tarefa
   * @returns {Promise<boolean>} True se removida, false se não encontrada
   */
  delete(id: string): Promise<boolean>;

  /**
   * Conta o total de tarefas no repositório
   * 
   * @returns {Promise<number>} Número total de tarefas
   */
  count(): Promise<number>;

  /**
   * Conta tarefas por status
   * 
   * @param {TaskStatus} status - Status para contar
   * @returns {Promise<number>} Número de tarefas com o status especificado
   */
  countByStatus(status: TaskStatus): Promise<number>;

  /**
   * Limpa todos os dados do repositório
   * 
   * @returns {Promise<void>}
   */
  clear(): Promise<void>;
}
