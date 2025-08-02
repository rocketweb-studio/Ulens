# ========== STAGE 1: Установка зависимостей ==========
FROM node:20.11-alpine AS dependencies

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

WORKDIR /app

# Копируем только файлы для установки зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости без запуска скриптов postinstall
RUN pnpm install --frozen-lockfile


# ========== STAGE 2: Сборка проекта ==========
FROM node:20.11-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# Копируем исходный код проекта
COPY . .

# Копируем установленные зависимости из предыдущего этапа
COPY --from=dependencies /app/node_modules ./node_modules

# Сборка проекта
RUN pnpm build


# ========== STAGE 3: Запуск приложения ==========
FROM node:20.11-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production

# Копируем собранный проект
COPY --from=builder /app ./

# Указываем порт (если нужен для локального запуска или Docker Compose)
EXPOSE 3000

# Запуск приложения
CMD ["pnpm", "start"]
