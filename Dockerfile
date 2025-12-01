# ============================================
# TaskFlow API - Dockerfile
# Trabalho Prático - Gerência de Configuração
# PUC Minas
# ============================================

# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

# Metadados da imagem
LABEL maintainer="Equipe TaskFlow - PUC Minas"
LABEL description="API de gerenciamento de tarefas - TaskFlow"
LABEL version="1.0.0"

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar TODAS as dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY tsconfig.json ./
COPY src ./src

# Compilar TypeScript para JavaScript
RUN npm run build

# Remover devDependencies após o build
RUN npm prune --production

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS production

# Metadados da imagem
LABEL maintainer="Equipe TaskFlow - PUC Minas"
LABEL description="API de gerenciamento de tarefas - TaskFlow"
LABEL version="1.0.0"

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs \
    && adduser -S taskflow -u 1001

# Diretório de trabalho
WORKDIR /app

# Copiar apenas o necessário do stage de build
COPY --from=builder --chown=taskflow:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=taskflow:nodejs /app/dist ./dist
COPY --from=builder --chown=taskflow:nodejs /app/package*.json ./

# Usar usuário não-root
USER taskflow

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
