/**
 * TaskFlow - Rotas de Tarefas
 * 
 * Define todas as rotas relacionadas ao gerenciamento de tarefas.
 * 
 * @module routes/taskRoutes
 * @author Equipe TaskFlow - PUC Minas
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lista todas as tarefas
 *     description: Retorna uma lista completa de todas as tarefas do sistema
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: Lista de tarefas recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Cria uma nova tarefa
 *     description: Adiciona uma nova tarefa ao sistema
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskDTO'
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Dados de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /tasks/{id}:
 *   get:
 *     summary: Busca uma tarefa pelo ID
 *     description: Retorna os detalhes de uma tarefa específica
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da tarefa
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Atualiza uma tarefa existente
 *     description: Modifica os dados de uma tarefa específica
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskDTO'
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Dados de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Remove uma tarefa
 *     description: Deleta uma tarefa específica do sistema
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da tarefa
 *     responses:
 *       204:
 *         description: Tarefa removida com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /tasks/stats:
 *   get:
 *     summary: Obtém estatísticas das tarefas
 *     description: Retorna contagens de tarefas por status e percentual de conclusão
 *     tags:
 *       - Statistics
 *     responses:
 *       200:
 *         description: Estatísticas recuperadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskStatistics'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /tasks/status/{status}:
 *   get:
 *     summary: Lista tarefas por status
 *     description: Retorna todas as tarefas filtradas por um status específico
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, done]
 *         description: Status para filtrar as tarefas
 *     responses:
 *       200:
 *         description: Tarefas filtradas por status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Status inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /tasks/{id}/done:
 *   patch:
 *     summary: Marca uma tarefa como concluída
 *     description: Altera o status de uma tarefa para 'done'
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da tarefa
 *     responses:
 *       200:
 *         description: Tarefa marcada como concluída
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /tasks/{id}/in-progress:
 *   patch:
 *     summary: Marca uma tarefa como em progresso
 *     description: Altera o status de uma tarefa para 'in_progress'
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da tarefa
 *     responses:
 *       200:
 *         description: Tarefa marcada como em progresso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /tasks/{id}/pending:
 *   patch:
 *     summary: Marca uma tarefa como pendente
 *     description: Altera o status de uma tarefa para 'pending'
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da tarefa
 *     responses:
 *       200:
 *         description: Tarefa marcada como pendente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarefa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';
import { InMemoryTaskRepository } from '../repositories/InMemoryTaskRepository';

/**
 * Cria e configura as rotas de tarefas
 * 
 * @param {TaskController} controller - Controlador de tarefas (opcional)
 * @returns {Router} Router do Express configurado
 */
export function createTaskRoutes(controller?: TaskController): Router {
  const router = Router();
  
  // Se não receber um controller, cria um com dependências padrão
  if (!controller) {
    const repository = new InMemoryTaskRepository();
    const service = new TaskService(repository);
    controller = new TaskController(service);
  }

  /**
   * @route GET /tasks/stats
   * @description Obtém estatísticas das tarefas
   * @access Public
   */
  router.get('/stats', (req, res, next) => controller!.getStatistics(req, res, next));

  /**
   * @route GET /tasks/status/:status
   * @description Lista tarefas por status
   * @access Public
   */
  router.get('/status/:status', (req, res, next) => controller!.findByStatus(req, res, next));

  /**
   * @route GET /tasks
   * @description Lista todas as tarefas
   * @access Public
   */
  router.get('/', (req, res, next) => controller!.findAll(req, res, next));

  /**
   * @route GET /tasks/:id
   * @description Busca uma tarefa pelo ID
   * @access Public
   */
  router.get('/:id', (req, res, next) => controller!.findById(req, res, next));

  /**
   * @route POST /tasks
   * @description Cria uma nova tarefa
   * @access Public
   */
  router.post('/', (req, res, next) => controller!.create(req, res, next));

  /**
   * @route PUT /tasks/:id
   * @description Atualiza uma tarefa existente
   * @access Public
   */
  router.put('/:id', (req, res, next) => controller!.update(req, res, next));

  /**
   * @route DELETE /tasks/:id
   * @description Remove uma tarefa
   * @access Public
   */
  router.delete('/:id', (req, res, next) => controller!.delete(req, res, next));

  /**
   * @route PATCH /tasks/:id/done
   * @description Marca uma tarefa como concluída
   * @access Public
   */
  router.patch('/:id/done', (req, res, next) => controller!.markAsDone(req, res, next));

  /**
   * @route PATCH /tasks/:id/in-progress
   * @description Marca uma tarefa como em progresso
   * @access Public
   */
  router.patch('/:id/in-progress', (req, res, next) => controller!.markAsInProgress(req, res, next));

  /**
   * @route PATCH /tasks/:id/pending
   * @description Marca uma tarefa como pendente
   * @access Public
   */
  router.patch('/:id/pending', (req, res, next) => controller!.markAsPending(req, res, next));

  return router;
}
