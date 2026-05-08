FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We don't have standalone enabled yet, so we'll just run npm start
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8080
CMD ["sh", "-c", "npm start -- -p ${PORT:-8080}"]
