/**
 * TaskFlow - Modelo de Tarefa
 * 
 * Este arquivo define a estrutura de dados principal do sistema TaskFlow.
 * Contém o enum de status, interfaces e a classe Task.
 * 
 * @module models/Task
 * @author Equipe TaskFlow - PUC Minas
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Enum que define os possíveis status de uma tarefa
 */
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

/**
 * Interface para criação de uma nova tarefa
 */
export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: TaskStatus;
}

/**
 * Interface para atualização de uma tarefa existente
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

/**
 * Interface que define a estrutura completa de uma tarefa
 */
export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Classe que representa uma Tarefa no sistema TaskFlow
 * 
 * @class Task
 * @implements {ITask}
 */
export class Task implements ITask {
  public readonly id: string;
  public title: string;
  public description: string;
  public status: TaskStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;

  /**
   * Cria uma nova instância de Task
   * 
   * @param {CreateTaskDTO} data - Dados para criação da tarefa
   */
  constructor(data: CreateTaskDTO) {
    this.id = uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.status = data.status || TaskStatus.PENDING;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Atualiza os campos da tarefa
   * 
   * @param {UpdateTaskDTO} data - Dados para atualização
   * @returns {Task} A própria instância atualizada
   */
  public update(data: UpdateTaskDTO): Task {
    if (data.title !== undefined) {
      this.title = data.title;
    }
    if (data.description !== undefined) {
      this.description = data.description;
    }
    if (data.status !== undefined) {
      this.status = data.status;
    }
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Marca a tarefa como concluída
   * 
   * @returns {Task} A própria instância atualizada
   */
  public markAsDone(): Task {
    this.status = TaskStatus.DONE;
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Marca a tarefa como em progresso
   * 
   * @returns {Task} A própria instância atualizada
   */
  public markAsInProgress(): Task {
    this.status = TaskStatus.IN_PROGRESS;
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Marca a tarefa como pendente
   * 
   * @returns {Task} A própria instância atualizada
   */
  public markAsPending(): Task {
    this.status = TaskStatus.PENDING;
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Verifica se a tarefa está concluída
   * 
   * @returns {boolean} True se a tarefa estiver concluída
   */
  public isDone(): boolean {
    return this.status === TaskStatus.DONE;
  }

  /**
   * Verifica se a tarefa está em progresso
   * 
   * @returns {boolean} True se a tarefa estiver em progresso
   */
  public isInProgress(): boolean {
    return this.status === TaskStatus.IN_PROGRESS;
  }

  /**
   * Verifica se a tarefa está pendente
   * 
   * @returns {boolean} True se a tarefa estiver pendente
   */
  public isPending(): boolean {
    return this.status === TaskStatus.PENDING;
  }

  /**
   * Converte a tarefa para formato JSON
   * 
   * @returns {ITask} Objeto com os dados da tarefa
   */
  public toJSON(): ITask {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Cria uma instância de Task a partir de um objeto ITask
   * 
   * @static
   * @param {ITask} data - Dados da tarefa
   * @returns {Task} Nova instância de Task
   */
  public static fromJSON(data: ITask): Task {
    const task = new Task({
      title: data.title,
      description: data.description,
      status: data.status
    });
    // Sobrescreve os campos readonly usando Object.assign
    Object.assign(task, {
      id: data.id,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    });
    return task;
  }
}
