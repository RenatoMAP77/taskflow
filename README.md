![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
# TaskFlow API

> Sistema de Gerenciamento de Tarefas - Trabalho Prático de Gerência de Configuração e Evolução de Software - PUC Minas

## 📋 Sobre o Projeto

TaskFlow é uma API RESTful para gerenciamento de tarefas, desenvolvida como trabalho prático da disciplina de Gerência de Configuração e Evolução de Software da PUC Minas.

### Funcionalidades

- ✅ Criar tarefas
- ✅ Listar todas as tarefas
- ✅ Buscar tarefa por ID
- ✅ Atualizar tarefas
- ✅ Deletar tarefas
- ✅ Filtrar por status (pending, in_progress, done)
- ✅ Marcar tarefa como concluída
- ✅ Estatísticas de tarefas

## 🛠️ Tecnologias

- **Node.js** (v18+)
- **TypeScript**
- **Express.js**
- **Jest** (testes)
- **Docker**

## 📁 Estrutura do Projeto

```
taskflow/
├── src/
│   ├── models/          # Modelos de dados
│   ├── repositories/    # Camada de acesso a dados
│   ├── services/        # Lógica de negócio
│   ├── controllers/     # Controladores HTTP
│   ├── routes/          # Rotas da API
│   ├── middlewares/     # Middlewares Express
│   ├── config/          # Configurações
│   ├── utils/           # Utilitários
│   ├── app.ts           # Configuração do Express
│   └── server.ts        # Ponto de entrada
├── tests/
│   ├── unit/            # Testes unitários
│   ├── integration/     # Testes de integração
│   └── acceptance/      # Testes de aceitação
├── package.json
├── tsconfig.json
├── jest.config.ts
├── Dockerfile
└── docker-compose.yml
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/RenatoMAP77/taskflow.git
cd taskflow

# Instalar dependências
npm install
```

### Desenvolvimento

```bash
# Executar em modo desenvolvimento
npm run dev
```

### Build

```bash
# Compilar TypeScript
npm run build

# Executar versão compilada
npm start
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes de aceitação
npm run test:acceptance
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t taskflow-api:1.0.0 .

# Usando docker-compose
docker-compose up -d
```

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | / | Informações da API |
| GET | /health | Health check |
| GET | /docs | Documentação Swagger UI |
| GET | /docs.json | Especificação OpenAPI |
| GET | /api/v1/tasks | Listar todas as tarefas |
| GET | /api/v1/tasks/:id | Buscar tarefa por ID |
| GET | /api/v1/tasks/status/:status | Filtrar por status |
| GET | /api/v1/tasks/stats | Estatísticas |
| POST | /api/v1/tasks | Criar tarefa |
| PUT | /api/v1/tasks/:id | Atualizar tarefa |
| DELETE | /api/v1/tasks/:id | Deletar tarefa |
| PATCH | /api/v1/tasks/:id/done | Marcar como concluída |
| PATCH | /api/v1/tasks/:id/in-progress | Marcar como em progresso |
| PATCH | /api/v1/tasks/:id/pending | Marcar como pendente |

### Documentação Swagger

A API possui documentação interativa gerada automaticamente com Swagger/OpenAPI 3.0.

**Acessar a documentação:**

```
http://localhost:3000/docs
```

A documentação inclui:
- ✅ Descrição de todos os endpoints
- ✅ Parâmetros de entrada e saída
- ✅ Exemplos de requisições e respostas
- ✅ Códigos de status HTTP
- ✅ Interface interativa para testar os endpoints

### Exemplo de Requisição

```bash
# Criar tarefa
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Minha Tarefa", "description": "Descrição da tarefa"}'
```

## 📊 Métricas do Projeto

- **Arquivos TypeScript:** 19+
- **Métodos/Funções:** 80+
- **Cobertura de Testes:** 70%+

## 👥 Equipe

- Renato Matos - [GitHub](https://github.com/RenatoMAP77)
- Felipe Picinin - [GitHub](https://github.com/felipepicinin)
- Lucas Garcia - [GitHub](https://github.com/lucasgarcia)
- Renato Cazzoleti - [GitHub](https://github.com/renatocazzoleti)
- Pedro Braga - [GitHub](https://github.com/bragap)

## 📄 Licença

MIT
