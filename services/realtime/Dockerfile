FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
# Run tidy after copying all source files so it can resolve dependencies correctly
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o realtime main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/realtime .
CMD ["./realtime"]
