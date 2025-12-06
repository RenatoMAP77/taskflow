/**
 * TaskFlow - Testes de Integração do TaskController
 * 
 * Testa as rotas da API de forma integrada.
 * 
 * @module tests/integration/TaskController.test
 * @author Equipe TaskFlow - PUC Minas
 */

import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../app';
import { TaskController } from '../../controllers/TaskController';
import { TaskService } from '../../services/TaskService';
import { InMemoryTaskRepository } from '../../repositories/InMemoryTaskRepository';
import { TaskStatus } from '../../models/Task';

describe('TaskController Integration Tests', () => {
    let app: Application;
    let repository: InMemoryTaskRepository;

    beforeEach(() => {
        repository = new InMemoryTaskRepository();
        const service = new TaskService(repository);
        const controller = new TaskController(service);
        app = createApp(controller);
    });

    afterEach(async () => {
        await repository.clear();
    });

    describe('POST /api/v1/tasks', () => {
        it('deve criar uma nova tarefa', async () => {
            const taskData = {
                title: 'Nova Tarefa',
                description: 'Descrição da tarefa'
            };

            const response = await request(app)
                .post('/api/v1/tasks')
                .send(taskData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe(taskData.title);
            expect(response.body.data.description).toBe(taskData.description);
            expect(response.body.data.status).toBe(TaskStatus.PENDING);
            expect(response.body.data.id).toBeDefined();
        });

        it('deve criar tarefa com status personalizado', async () => {
            const taskData = {
                title: 'Tarefa',
                description: 'Desc',
                status: TaskStatus.IN_PROGRESS
            };

            const response = await request(app)
                .post('/api/v1/tasks')
                .send(taskData)
                .expect(201);

            expect(response.body.data.status).toBe(TaskStatus.IN_PROGRESS);
        });

        it('deve retornar erro 400 para título vazio', async () => {
            const response = await request(app)
                .post('/api/v1/tasks')
                .send({ title: '', description: 'Desc' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('INVALID_TITLE');
        });

        it('deve retornar erro 400 para descrição vazia', async () => {
            const response = await request(app)
                .post('/api/v1/tasks')
                .send({ title: 'Título', description: '' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('INVALID_DESCRIPTION');
        });
    });

    describe('GET /api/v1/tasks', () => {
        it('deve retornar array vazio quando não há tarefas', async () => {
            const response = await request(app)
                .get('/api/v1/tasks')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(0);
            expect(response.body.data).toEqual([]);
        });

        it('deve retornar todas as tarefas', async () => {
            await repository.create({ title: 'T1', description: 'D1' });
            await repository.create({ title: 'T2', description: 'D2' });

            const response = await request(app)
                .get('/api/v1/tasks')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(2);
            expect(response.body.data).toHaveLength(2);
        });
    });

    describe('GET /api/v1/tasks/:id', () => {
        it('deve retornar uma tarefa pelo ID', async () => {
            const created = await repository.create({
                title: 'Tarefa Teste',
                description: 'Desc'
            });

            const response = await request(app)
                .get(`/api/v1/tasks/${created.id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(created.id);
            expect(response.body.data.title).toBe('Tarefa Teste');
        });

        it('deve retornar 404 para ID inexistente', async () => {
            const response = await request(app)
                .get('/api/v1/tasks/id-inexistente')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('TASK_NOT_FOUND');
        });
    });

    describe('GET /api/v1/tasks/status/:status', () => {
        beforeEach(async () => {
            await repository.create({ title: 'P1', description: 'D' });
            await repository.create({ title: 'P2', description: 'D' });
            await repository.create({
                title: 'IP1',
                description: 'D',
                status: TaskStatus.IN_PROGRESS
            });
        });

        it('deve filtrar por status PENDING', async () => {
            const response = await request(app)
                .get('/api/v1/tasks/status/pending')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(2);
        });

        it('deve filtrar por status IN_PROGRESS', async () => {
            const response = await request(app)
                .get('/api/v1/tasks/status/in_progress')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
        });
    });

    describe('PUT /api/v1/tasks/:id', () => {
        let taskId: string;

        beforeEach(async () => {
            const task = await repository.create({
                title: 'Original',
                description: 'Desc Original'
            });
            taskId = task.id;
        });

        it('deve atualizar a tarefa', async () => {
            const response = await request(app)
                .put(`/api/v1/tasks/${taskId}`)
                .send({ title: 'Novo Título', description: 'Nova Desc' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe('Novo Título');
            expect(response.body.data.description).toBe('Nova Desc');
        });

        it('deve atualizar apenas o status', async () => {
            const response = await request(app)
                .put(`/api/v1/tasks/${taskId}`)
                .send({ status: TaskStatus.DONE })
                .expect(200);

            expect(response.body.data.status).toBe(TaskStatus.DONE);
            expect(response.body.data.title).toBe('Original');
        });

        it('deve retornar 404 para tarefa inexistente', async () => {
            const response = await request(app)
                .put('/api/v1/tasks/id-inexistente')
                .send({ title: 'Novo' })
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('DELETE /api/v1/tasks/:id', () => {
        it('deve deletar uma tarefa', async () => {
            const task = await repository.create({ title: 'T', description: 'D' });

            const response = await request(app)
                .delete(`/api/v1/tasks/${task.id}`)
                .expect(200);

            expect(response.body.success).toBe(true);

            // Verificar que foi deletada
            const found = await repository.findById(task.id);
            expect(found).toBeNull();
        });

        it('deve retornar 404 para tarefa inexistente', async () => {
            const response = await request(app)
                .delete('/api/v1/tasks/id-inexistente')
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PATCH /api/v1/tasks/:id/done', () => {
        it('deve marcar tarefa como concluída', async () => {
            const task = await repository.create({ title: 'T', description: 'D' });

            const response = await request(app)
                .patch(`/api/v1/tasks/${task.id}/done`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe(TaskStatus.DONE);
        });
    });

    describe('PATCH /api/v1/tasks/:id/in-progress', () => {
        it('deve marcar tarefa como em progresso', async () => {
            const task = await repository.create({ title: 'T', description: 'D' });

            const response = await request(app)
                .patch(`/api/v1/tasks/${task.id}/in-progress`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe(TaskStatus.IN_PROGRESS);
        });
    });

    describe('PATCH /api/v1/tasks/:id/pending', () => {
        it('deve marcar tarefa como pendente', async () => {
            const task = await repository.create({
                title: 'T',
                description: 'D',
                status: TaskStatus.DONE
            });

            const response = await request(app)
                .patch(`/api/v1/tasks/${task.id}/pending`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe(TaskStatus.PENDING);
        });
    });

    describe('GET /api/v1/tasks/stats', () => {
        it('deve retornar estatísticas zeradas', async () => {
            const response = await request(app)
                .get('/api/v1/tasks/stats')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.total).toBe(0);
            expect(response.body.data.completionRate).toBe(0);
        });

        it('deve retornar estatísticas corretas', async () => {
            await repository.create({ title: 'T1', description: 'D' });
            await repository.create({ title: 'T2', description: 'D' });
            await repository.create({
                title: 'T3',
                description: 'D',
                status: TaskStatus.DONE
            });
            await repository.create({
                title: 'T4',
                description: 'D',
                status: TaskStatus.DONE
            });

            const response = await request(app)
                .get('/api/v1/tasks/stats')
                .expect(200);

            expect(response.body.data.total).toBe(4);
            expect(response.body.data.pending).toBe(2);
            expect(response.body.data.done).toBe(2);
            expect(response.body.data.completionRate).toBe(50);
        });
    });

    describe('Rotas auxiliares', () => {
        it('GET / deve retornar informações da API', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);

            expect(response.body.name).toBe('TaskFlow API');
            expect(response.body.version).toBe('1.0.0');
        });

        it('GET /health deve retornar status healthy', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body.status).toBe('healthy');
        });

        it('deve retornar 404 para rota inexistente', async () => {
            const response = await request(app)
                .get('/rota-que-nao-existe')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
        });
    });
});
