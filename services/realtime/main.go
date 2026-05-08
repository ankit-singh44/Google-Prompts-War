package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/wayfinderai/realtime/disruption"
	"cloud.google.com/go/pubsub"
	"net/http"
)

func main() {
	slog.Info("starting realtime disruption service")
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	projectID := os.Getenv("PROJECT_ID")
	if projectID == "" {
		slog.Error("PROJECT_ID env var required")
		os.Exit(1)
	}

	client, err := pubsub.NewClient(ctx, projectID)
	if err != nil {
		slog.Error("failed to create pubsub client", "error", err)
		os.Exit(1)
	}

	plannerURL := os.Getenv("PLANNER_SERVICE_URL")
	if plannerURL == "" {
		slog.Error("PLANNER_SERVICE_URL env var required")
		os.Exit(1)
	}

	plannerClient := disruption.NewPlannerClient(plannerURL)
	handler := disruption.NewHandler(plannerClient)

	sub := client.Subscription("disruption-events-sub")
	
	go func() {
		err = sub.Receive(ctx, handler.ProcessDisruption)
		if err != nil {
			slog.Error("subscription receive error", "error", err)
		}
	}()

	// Start a dummy HTTP server for Cloud Run health check
	go func() {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
		http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("ok"))
		})
		slog.Info("Health check server starting", "port", port)
		if err := http.ListenAndServe(":"+port, nil); err != nil {
			slog.Error("health check server failed", "error", err)
		}
	}()

	// Wait for interrupt
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	<-sigCh

	slog.Info("shutting down")
}
