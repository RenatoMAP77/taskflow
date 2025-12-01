/**
 * TaskFlow - Testes Unitários do InMemoryTaskRepository
 * 
 * Testa as operações do repositório in-memory.
 * 
 * @module tests/unit/InMemoryTaskRepository.test
 * @author Equipe TaskFlow - PUC Minas
 */

import { InMemoryTaskRepository } from '../../src/repositories/InMemoryTaskRepository';
import { TaskStatus } from '../../src/models/Task';

describe('InMemoryTaskRepository', () => {
  let repository: InMemoryTaskRepository;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
  });

  afterEach(async () => {
    await repository.clear();
  });

  describe('create', () => {
    it('deve criar uma tarefa e retorná-la', async () => {
      const data = {
        title: 'Nova Tarefa',
        description: 'Descrição da tarefa'
      };

      const task = await repository.create(data);

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.title).toBe(data.title);
      expect(task.description).toBe(data.description);
      expect(task.status).toBe(TaskStatus.PENDING);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it('deve criar tarefa com status personalizado', async () => {
      const data = {
        title: 'Tarefa',
        description: 'Desc',
        status: TaskStatus.IN_PROGRESS
      };

      const task = await repository.create(data);

      expect(task.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('deve criar múltiplas tarefas com IDs únicos', async () => {
      const task1 = await repository.create({ title: 'T1', description: 'D1' });
      const task2 = await repository.create({ title: 'T2', description: 'D2' });

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('findAll', () => {
    it('deve retornar array vazio quando não há tarefas', async () => {
      const tasks = await repository.findAll();
      expect(tasks).toEqual([]);
    });

    it('deve retornar todas as tarefas', async () => {
      await repository.create({ title: 'T1', description: 'D1' });
      await repository.create({ title: 'T2', description: 'D2' });
      await repository.create({ title: 'T3', description: 'D3' });

      const tasks = await repository.findAll();

      expect(tasks).toHaveLength(3);
    });
  });

  describe('findById', () => {
    it('deve encontrar tarefa pelo ID', async () => {
      const created = await repository.create({
        title: 'Tarefa Teste',
        description: 'Descrição'
      });

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('deve retornar null para ID inexistente', async () => {
      const found = await repository.findById('id-que-nao-existe');
      expect(found).toBeNull();
    });
  });

  describe('findByStatus', () => {
    beforeEach(async () => {
      await repository.create({ title: 'P1', description: 'D' });
      await repository.create({ title: 'P2', description: 'D' });
      await repository.create({ 
        title: 'IP1', 
        description: 'D',
        status: TaskStatus.IN_PROGRESS
      });
      await repository.create({ 
        title: 'D1', 
        description: 'D',
        status: TaskStatus.DONE
      });
    });

    it('deve filtrar por PENDING', async () => {
      const tasks = await repository.findByStatus(TaskStatus.PENDING);
      
      expect(tasks).toHaveLength(2);
      tasks.forEach(task => {
        expect(task.status).toBe(TaskStatus.PENDING);
      });
    });

    it('deve filtrar por IN_PROGRESS', async () => {
      const tasks = await repository.findByStatus(TaskStatus.IN_PROGRESS);
      
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('IP1');
    });

    it('deve filtrar por DONE', async () => {
      const tasks = await repository.findByStatus(TaskStatus.DONE);
      
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('D1');
    });
  });

  describe('update', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await repository.create({
        title: 'Original',
        description: 'Desc Original'
      });
      taskId = task.id;
    });

    it('deve atualizar título', async () => {
      const updated = await repository.update(taskId, { title: 'Novo Título' });

      expect(updated?.title).toBe('Novo Título');
      expect(updated?.description).toBe('Desc Original');
    });

    it('deve atualizar descrição', async () => {
      const updated = await repository.update(taskId, { description: 'Nova Desc' });

      expect(updated?.description).toBe('Nova Desc');
    });

    it('deve atualizar status', async () => {
      const updated = await repository.update(taskId, { status: TaskStatus.DONE });

      expect(updated?.status).toBe(TaskStatus.DONE);
    });

    it('deve atualizar updatedAt', async () => {
      const original = await repository.findById(taskId);
      const originalUpdatedAt = original?.updatedAt;

      // Pequeno delay para garantir diferença de tempo
      await new Promise(resolve => setTimeout(resolve, 10));

      const updated = await repository.update(taskId, { title: 'Novo' });

      expect(updated?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt!.getTime());
    });

    it('deve retornar null para ID inexistente', async () => {
      const result = await repository.update('id-inexistente', { title: 'Novo' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('deve deletar tarefa existente', async () => {
      const task = await repository.create({ title: 'T', description: 'D' });
      
      const deleted = await repository.delete(task.id);

      expect(deleted).toBe(true);
      
      const found = await repository.findById(task.id);
      expect(found).toBeNull();
    });

    it('deve retornar false para ID inexistente', async () => {
      const deleted = await repository.delete('id-inexistente');
      expect(deleted).toBe(false);
    });
  });

  describe('count', () => {
    it('deve retornar 0 quando não há tarefas', async () => {
      const count = await repository.count();
      expect(count).toBe(0);
    });

    it('deve retornar contagem correta', async () => {
      await repository.create({ title: 'T1', description: 'D' });
      await repository.create({ title: 'T2', description: 'D' });
      await repository.create({ title: 'T3', description: 'D' });

      const count = await repository.count();
      expect(count).toBe(3);
    });
  });

  describe('countByStatus', () => {
    beforeEach(async () => {
      await repository.create({ title: 'P1', description: 'D' });
      await repository.create({ title: 'P2', description: 'D' });
      await repository.create({ 
        title: 'IP1', 
        description: 'D',
        status: TaskStatus.IN_PROGRESS
      });
    });

    it('deve contar por PENDING', async () => {
      const count = await repository.countByStatus(TaskStatus.PENDING);
      expect(count).toBe(2);
    });

    it('deve contar por IN_PROGRESS', async () => {
      const count = await repository.countByStatus(TaskStatus.IN_PROGRESS);
      expect(count).toBe(1);
    });

    it('deve retornar 0 para status sem tarefas', async () => {
      const count = await repository.countByStatus(TaskStatus.DONE);
      expect(count).toBe(0);
    });
  });

  describe('clear', () => {
    it('deve remover todas as tarefas', async () => {
      await repository.create({ title: 'T1', description: 'D' });
      await repository.create({ title: 'T2', description: 'D' });
      await repository.create({ title: 'T3', description: 'D' });

      await repository.clear();

      const count = await repository.count();
      expect(count).toBe(0);
    });
  });

  describe('exists', () => {
    it('deve retornar true para tarefa existente', async () => {
      const task = await repository.create({ title: 'T', description: 'D' });
      
      const exists = await repository.exists(task.id);
      expect(exists).toBe(true);
    });

    it('deve retornar false para tarefa inexistente', async () => {
      const exists = await repository.exists('id-inexistente');
      expect(exists).toBe(false);
    });
  });

  describe('findByTitle', () => {
    beforeEach(async () => {
      await repository.create({ title: 'Comprar pão', description: 'D' });
      await repository.create({ title: 'Comprar leite', description: 'D' });
      await repository.create({ title: 'Estudar TypeScript', description: 'D' });
    });

    it('deve buscar por título parcial', async () => {
      const tasks = await repository.findByTitle('Comprar');
      expect(tasks).toHaveLength(2);
    });

    it('deve ser case-insensitive', async () => {
      const tasks = await repository.findByTitle('COMPRAR');
      expect(tasks).toHaveLength(2);
    });

    it('deve retornar vazio se não encontrar', async () => {
      const tasks = await repository.findByTitle('Vender');
      expect(tasks).toHaveLength(0);
    });
  });
});
