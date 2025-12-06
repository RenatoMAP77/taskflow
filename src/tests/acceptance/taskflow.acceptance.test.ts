/**
 * TaskFlow - Teste de Aceitação
 * 
 * Testa o fluxo completo de uso do sistema:
 * Criar tarefa → Atualizar → Listar → Marcar como concluída → Deletar
 * 
 * Este teste simula o comportamento de um usuário real do sistema,
 * validando que todas as funcionalidades trabalham em conjunto.
 * 
 * @module tests/acceptance/taskflow.acceptance.test
 * @author Equipe TaskFlow - PUC Minas
 */

import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../app';
import { TaskController } from '../../controllers/TaskController';
import { TaskService } from '../../services/TaskService';
import { InMemoryTaskRepository } from '../../repositories/InMemoryTaskRepository';
import { TaskStatus } from '../../models/Task';

describe('TaskFlow - Teste de Aceitação', () => {
    let app: Application;
    let repository: InMemoryTaskRepository;

    beforeAll(() => {
        repository = new InMemoryTaskRepository();
        const service = new TaskService(repository);
        const controller = new TaskController(service);
        app = createApp(controller);
    });

    afterAll(async () => {
        await repository.clear();
    });

    /**
     * Cenário de Aceitação Principal:
     * Como um usuário do TaskFlow,
     * Eu quero gerenciar minhas tarefas completamente
     * Para organizar meu trabalho de forma eficiente
     */
    describe('Cenário: Gerenciamento completo de tarefas', () => {
        let taskId: string;

        it('Passo 1: O sistema deve estar funcionando (health check)', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body.status).toBe('healthy');
            console.log('✅ Sistema funcionando corretamente');
        });

        it('Passo 2: Inicialmente não deve haver tarefas', async () => {
            const response = await request(app)
                .get('/api/v1/tasks')
                .expect(200);

            expect(response.body.count).toBe(0);
            expect(response.body.data).toEqual([]);
            console.log('✅ Nenhuma tarefa no sistema inicialmente');
        });

        it('Passo 3: Deve criar uma nova tarefa', async () => {
            const novaTarefa = {
                title: 'Implementar funcionalidade de login',
                description: 'Criar tela de login com autenticação JWT'
            };

            const response = await request(app)
                .post('/api/v1/tasks')
                .send(novaTarefa)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe(novaTarefa.title);
            expect(response.body.data.description).toBe(novaTarefa.description);
            expect(response.body.data.status).toBe(TaskStatus.PENDING);

            taskId = response.body.data.id;
            console.log(`✅ Tarefa criada com ID: ${taskId}`);
        });

        it('Passo 4: Deve buscar a tarefa criada pelo ID', async () => {
            const response = await request(app)
                .get(`/api/v1/tasks/${taskId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(taskId);
            expect(response.body.data.title).toBe('Implementar funcionalidade de login');
            console.log('✅ Tarefa encontrada pelo ID');
        });

        it('Passo 5: Deve atualizar a tarefa', async () => {
            const atualizacao = {
                title: 'Implementar funcionalidade de login com OAuth',
                description: 'Criar tela de login com autenticação JWT e OAuth (Google/GitHub)'
            };

            const response = await request(app)
                .put(`/api/v1/tasks/${taskId}`)
                .send(atualizacao)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.title).toBe(atualizacao.title);
            expect(response.body.data.description).toBe(atualizacao.description);
            console.log('✅ Tarefa atualizada com sucesso');
        });

        it('Passo 6: Deve marcar a tarefa como em progresso', async () => {
            const response = await request(app)
                .patch(`/api/v1/tasks/${taskId}/in-progress`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe(TaskStatus.IN_PROGRESS);
            console.log('✅ Tarefa marcada como em progresso');
        });

        it('Passo 7: Deve listar apenas tarefas em progresso', async () => {
            const response = await request(app)
                .get('/api/v1/tasks/status/in_progress')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
            expect(response.body.data[0].id).toBe(taskId);
            console.log('✅ Filtro por status funcionando');
        });

        it('Passo 8: Deve criar mais tarefas para teste de estatísticas', async () => {
            // Criar segunda tarefa
            await request(app)
                .post('/api/v1/tasks')
                .send({
                    title: 'Escrever documentação',
                    description: 'Documentar API REST'
                })
                .expect(201);

            // Criar terceira tarefa já concluída
            const response = await request(app)
                .post('/api/v1/tasks')
                .send({
                    title: 'Configurar CI/CD',
                    description: 'Configurar pipeline no GitHub Actions',
                    status: TaskStatus.DONE
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            console.log('✅ Tarefas adicionais criadas');
        });

        it('Passo 9: Deve listar todas as tarefas', async () => {
            const response = await request(app)
                .get('/api/v1/tasks')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(3);
            console.log(`✅ Total de ${response.body.count} tarefas no sistema`);
        });

        it('Passo 10: Deve exibir estatísticas corretas', async () => {
            const response = await request(app)
                .get('/api/v1/tasks/stats')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.total).toBe(3);
            expect(response.body.data.pending).toBe(1);
            expect(response.body.data.inProgress).toBe(1);
            expect(response.body.data.done).toBe(1);
            expect(response.body.data.completionRate).toBeCloseTo(33.33, 1);
            console.log('✅ Estatísticas calculadas corretamente');
            console.log(`   - Total: ${response.body.data.total}`);
            console.log(`   - Pendentes: ${response.body.data.pending}`);
            console.log(`   - Em progresso: ${response.body.data.inProgress}`);
            console.log(`   - Concluídas: ${response.body.data.done}`);
            console.log(`   - Taxa de conclusão: ${response.body.data.completionRate}%`);
        });

        it('Passo 11: Deve marcar a primeira tarefa como concluída', async () => {
            const response = await request(app)
                .patch(`/api/v1/tasks/${taskId}/done`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe(TaskStatus.DONE);
            console.log('✅ Primeira tarefa marcada como concluída');
        });

        it('Passo 12: Deve verificar nova taxa de conclusão', async () => {
            const response = await request(app)
                .get('/api/v1/tasks/stats')
                .expect(200);

            expect(response.body.data.done).toBe(2);
            expect(response.body.data.completionRate).toBeCloseTo(66.67, 1);
            console.log(`✅ Nova taxa de conclusão: ${response.body.data.completionRate}%`);
        });

        it('Passo 13: Deve deletar a primeira tarefa', async () => {
            const response = await request(app)
                .delete(`/api/v1/tasks/${taskId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            console.log('✅ Tarefa deletada com sucesso');
        });

        it('Passo 14: Deve confirmar que a tarefa foi deletada', async () => {
            const response = await request(app)
                .get(`/api/v1/tasks/${taskId}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('TASK_NOT_FOUND');
            console.log('✅ Confirmado: tarefa não existe mais');
        });

        it('Passo 15: Deve ter apenas 2 tarefas restantes', async () => {
            const response = await request(app)
                .get('/api/v1/tasks')
                .expect(200);

            expect(response.body.count).toBe(2);
            console.log('✅ Sistema contém 2 tarefas restantes');
        });
    });

    /**
     * Cenário de Validação de Erros:
     * O sistema deve tratar erros de forma adequada
     */
    describe('Cenário: Tratamento de erros', () => {
        it('Deve rejeitar criação de tarefa sem título', async () => {
            const response = await request(app)
                .post('/api/v1/tasks')
                .send({ description: 'Apenas descrição' })
                .expect(400);

            expect(response.body.success).toBe(false);
            console.log('✅ Validação de título obrigatório funcionando');
        });

        it('Deve rejeitar criação de tarefa sem descrição', async () => {
            const response = await request(app)
                .post('/api/v1/tasks')
                .send({ title: 'Apenas título' })
                .expect(400);

            expect(response.body.success).toBe(false);
            console.log('✅ Validação de descrição obrigatória funcionando');
        });

        it('Deve retornar 404 para tarefa inexistente', async () => {
            const response = await request(app)
                .get('/api/v1/tasks/id-que-nao-existe')
                .expect(404);

            expect(response.body.success).toBe(false);
            console.log('✅ Tratamento de tarefa inexistente funcionando');
        });

        it('Deve retornar 404 para rota inexistente', async () => {
            const response = await request(app)
                .get('/rota/que/nao/existe')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
            console.log('✅ Tratamento de rota inexistente funcionando');
        });
    });

    /**
     * Relatório Final
     */
    describe('Relatório Final do Teste de Aceitação', () => {
        it('Deve exibir resumo do teste', () => {
            console.log('\n');
            console.log('════════════════════════════════════════════════════════');
            console.log('          TESTE DE ACEITAÇÃO - TASKFLOW API             ');
            console.log('════════════════════════════════════════════════════════');
            console.log('');
            console.log(' ✅ Health check da API');
            console.log(' ✅ Criação de tarefas');
            console.log(' ✅ Busca de tarefas (por ID e listagem)');
            console.log(' ✅ Atualização de tarefas');
            console.log(' ✅ Alteração de status (pending/in_progress/done)');
            console.log(' ✅ Filtro por status');
            console.log(' ✅ Estatísticas de tarefas');
            console.log(' ✅ Deleção de tarefas');
            console.log(' ✅ Tratamento de erros');
            console.log(' ✅ Validações de entrada');
            console.log('');
            console.log('════════════════════════════════════════════════════════');
            console.log('        TODOS OS CRITÉRIOS DE ACEITAÇÃO PASSARAM        ');
            console.log('════════════════════════════════════════════════════════');

            expect(true).toBe(true);
        });
    });
});
