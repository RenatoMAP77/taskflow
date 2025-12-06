/**
 * TaskFlow - Testes Unitários do TaskService
 * 
 * Testa a lógica de negócio do serviço de tarefas.
 * 
 * @module tests/unit/TaskService.test
 * @author Equipe TaskFlow - PUC Minas
 */

import { TaskService, TaskError } from '../../services/TaskService';
import { InMemoryTaskRepository } from '../../repositories/InMemoryTaskRepository';
import { TaskStatus } from '../../models/Task';

describe('TaskService', () => {
    let service: TaskService;
    let repository: InMemoryTaskRepository;

    beforeEach(() => {
        repository = new InMemoryTaskRepository();
        service = new TaskService(repository);
    });

    afterEach(async () => {
        await repository.clear();
    });

    describe('createTask', () => {
        it('deve criar uma tarefa com dados válidos', async () => {
            const taskData = {
                title: 'Minha Tarefa',
                description: 'Descrição da tarefa'
            };

            const task = await service.createTask(taskData);

            expect(task).toBeDefined();
            expect(task.title).toBe(taskData.title);
            expect(task.description).toBe(taskData.description);
            expect(task.status).toBe(TaskStatus.PENDING);
            expect(task.id).toBeDefined();
        });

        it('deve criar uma tarefa com status personalizado', async () => {
            const taskData = {
                title: 'Tarefa em Progresso',
                description: 'Descrição',
                status: TaskStatus.IN_PROGRESS
            };

            const task = await service.createTask(taskData);

            expect(task.status).toBe(TaskStatus.IN_PROGRESS);
        });

        it('deve lançar erro se título estiver vazio', async () => {
            const taskData = {
                title: '',
                description: 'Descrição válida'
            };

            await expect(service.createTask(taskData))
                .rejects.toThrow(TaskError);
        });

        it('deve lançar erro se descrição estiver vazia', async () => {
            const taskData = {
                title: 'Título válido',
                description: ''
            };

            await expect(service.createTask(taskData))
                .rejects.toThrow(TaskError);
        });

        it('deve lançar erro se título for muito longo', async () => {
            const taskData = {
                title: 'a'.repeat(201),
                description: 'Descrição válida'
            };

            await expect(service.createTask(taskData))
                .rejects.toThrow(TaskError);
        });
    });

    describe('getAllTasks', () => {
        it('deve retornar array vazio quando não houver tarefas', async () => {
            const tasks = await service.getAllTasks();
            expect(tasks).toEqual([]);
        });

        it('deve retornar todas as tarefas criadas', async () => {
            await service.createTask({ title: 'Tarefa 1', description: 'Desc 1' });
            await service.createTask({ title: 'Tarefa 2', description: 'Desc 2' });

            const tasks = await service.getAllTasks();

            expect(tasks).toHaveLength(2);
        });
    });

    describe('getTaskById', () => {
        it('deve retornar a tarefa pelo ID', async () => {
            const created = await service.createTask({
                title: 'Tarefa Teste',
                description: 'Descrição'
            });

            const found = await service.getTaskById(created.id);

            expect(found.id).toBe(created.id);
            expect(found.title).toBe(created.title);
        });

        it('deve lançar erro se tarefa não existir', async () => {
            await expect(service.getTaskById('id-inexistente'))
                .rejects.toThrow(TaskError);
        });

        it('deve lançar erro se ID for vazio', async () => {
            await expect(service.getTaskById(''))
                .rejects.toThrow(TaskError);
        });
    });

    describe('getTasksByStatus', () => {
        beforeEach(async () => {
            await service.createTask({ title: 'Pendente 1', description: 'Desc' });
            await service.createTask({ title: 'Pendente 2', description: 'Desc' });
            await service.createTask({
                title: 'Em Progresso',
                description: 'Desc',
                status: TaskStatus.IN_PROGRESS
            });
        });

        it('deve filtrar tarefas por status PENDING', async () => {
            const tasks = await service.getTasksByStatus(TaskStatus.PENDING);
            expect(tasks).toHaveLength(2);
            tasks.forEach(task => {
                expect(task.status).toBe(TaskStatus.PENDING);
            });
        });

        it('deve filtrar tarefas por status IN_PROGRESS', async () => {
            const tasks = await service.getTasksByStatus(TaskStatus.IN_PROGRESS);
            expect(tasks).toHaveLength(1);
            expect(tasks[0].status).toBe(TaskStatus.IN_PROGRESS);
        });

        it('deve retornar array vazio para status sem tarefas', async () => {
            const tasks = await service.getTasksByStatus(TaskStatus.DONE);
            expect(tasks).toEqual([]);
        });
    });

    describe('updateTask', () => {
        let taskId: string;

        beforeEach(async () => {
            const task = await service.createTask({
                title: 'Tarefa Original',
                description: 'Descrição Original'
            });
            taskId = task.id;
        });

        it('deve atualizar o título da tarefa', async () => {
            const updated = await service.updateTask(taskId, {
                title: 'Novo Título'
            });

            expect(updated.title).toBe('Novo Título');
            expect(updated.description).toBe('Descrição Original');
        });

        it('deve atualizar a descrição da tarefa', async () => {
            const updated = await service.updateTask(taskId, {
                description: 'Nova Descrição'
            });

            expect(updated.description).toBe('Nova Descrição');
        });

        it('deve atualizar o status da tarefa', async () => {
            const updated = await service.updateTask(taskId, {
                status: TaskStatus.DONE
            });

            expect(updated.status).toBe(TaskStatus.DONE);
        });

        it('deve atualizar múltiplos campos', async () => {
            const updated = await service.updateTask(taskId, {
                title: 'Novo Título',
                description: 'Nova Descrição',
                status: TaskStatus.IN_PROGRESS
            });

            expect(updated.title).toBe('Novo Título');
            expect(updated.description).toBe('Nova Descrição');
            expect(updated.status).toBe(TaskStatus.IN_PROGRESS);
        });

        it('deve lançar erro se tarefa não existir', async () => {
            await expect(service.updateTask('id-inexistente', { title: 'Novo' }))
                .rejects.toThrow(TaskError);
        });
    });

    describe('deleteTask', () => {
        it('deve remover uma tarefa existente', async () => {
            const task = await service.createTask({
                title: 'Tarefa para Deletar',
                description: 'Desc'
            });

            await expect(service.deleteTask(task.id)).resolves.not.toThrow();

            await expect(service.getTaskById(task.id))
                .rejects.toThrow(TaskError);
        });

        it('deve lançar erro ao tentar deletar tarefa inexistente', async () => {
            await expect(service.deleteTask('id-inexistente'))
                .rejects.toThrow(TaskError);
        });
    });

    describe('markTaskAsDone', () => {
        it('deve marcar tarefa como concluída', async () => {
            const task = await service.createTask({
                title: 'Tarefa',
                description: 'Desc'
            });

            const updated = await service.markTaskAsDone(task.id);

            expect(updated.status).toBe(TaskStatus.DONE);
        });
    });

    describe('markTaskAsInProgress', () => {
        it('deve marcar tarefa como em progresso', async () => {
            const task = await service.createTask({
                title: 'Tarefa',
                description: 'Desc'
            });

            const updated = await service.markTaskAsInProgress(task.id);

            expect(updated.status).toBe(TaskStatus.IN_PROGRESS);
        });
    });

    describe('markTaskAsPending', () => {
        it('deve marcar tarefa como pendente', async () => {
            const task = await service.createTask({
                title: 'Tarefa',
                description: 'Desc',
                status: TaskStatus.DONE
            });

            const updated = await service.markTaskAsPending(task.id);

            expect(updated.status).toBe(TaskStatus.PENDING);
        });
    });

    describe('getStatistics', () => {
        it('deve retornar estatísticas zeradas quando não há tarefas', async () => {
            const stats = await service.getStatistics();

            expect(stats.total).toBe(0);
            expect(stats.pending).toBe(0);
            expect(stats.inProgress).toBe(0);
            expect(stats.done).toBe(0);
            expect(stats.completionRate).toBe(0);
        });

        it('deve calcular estatísticas corretamente', async () => {
            await service.createTask({ title: 'T1', description: 'D' });
            await service.createTask({ title: 'T2', description: 'D' });
            await service.createTask({
                title: 'T3',
                description: 'D',
                status: TaskStatus.IN_PROGRESS
            });
            await service.createTask({
                title: 'T4',
                description: 'D',
                status: TaskStatus.DONE
            });

            const stats = await service.getStatistics();

            expect(stats.total).toBe(4);
            expect(stats.pending).toBe(2);
            expect(stats.inProgress).toBe(1);
            expect(stats.done).toBe(1);
            expect(stats.completionRate).toBe(25);
        });
    });
});
