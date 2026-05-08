package disruption

import (
	"bytes"
	"cloud.google.com/go/pubsub"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
)

type EventType string

const (
	EventWeather     EventType = "weather"
	EventFlightDelay EventType = "flight_delay"
	EventClosure     EventType = "closure"
	EventCrowdSurge  EventType = "crowd_surge"
)

type DisruptionEvent struct {
	TripID           string          `json:"trip_id"`
	Type             EventType       `json:"type"`
	Severity         int             `json:"severity"` // 1-5
	AffectedSegments []string        `json:"affected_segments"`
	Payload          json.RawMessage `json:"payload"`
}

type ReplanRequest struct {
	TripID           string   `json:"trip_id"`
	Reason           string   `json:"reason"`
	AffectedSegments []string `json:"affected_segments"`
}

type ErrTripNotFound struct {
	TripID string
}

func (e *ErrTripNotFound) Error() string {
	return fmt.Sprintf("trip not found: %s", e.TripID)
}

type PlannerClient struct {
	BaseURL string
	Client  *http.Client
}

func NewPlannerClient(baseURL string) *PlannerClient {
	return &PlannerClient{
		BaseURL: baseURL,
		Client:  &http.Client{},
	}
}

func (c *PlannerClient) TriggerReplan(ctx context.Context, req ReplanRequest) error {
	body, _ := json.Marshal(req)
	url := fmt.Sprintf("%s/replan", c.BaseURL)
	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.Client.Do(httpReq)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return &ErrTripNotFound{TripID: req.TripID}
	}
	if resp.StatusCode >= 400 {
		return fmt.Errorf("planner returned status: %d", resp.StatusCode)
	}

	return nil
}

type Handler struct {
	plannerClient *PlannerClient
}

func NewHandler(plannerClient *PlannerClient) *Handler {
	return &Handler{
		plannerClient: plannerClient,
	}
}

func (h *Handler) ProcessDisruption(ctx context.Context, msg *pubsub.Message) {
	var event DisruptionEvent
	if err := json.Unmarshal(msg.Data, &event); err != nil {
		slog.Error("unmarshal disruption", "error", err)
		msg.Nack()
		return
	}
	slog.Info("disruption received",
		"trip_id", event.TripID,
		"type", event.Type,
		"severity", event.Severity,
	)
	if event.Severity >= 3 {
		if err := h.plannerClient.TriggerReplan(ctx, ReplanRequest{
			TripID:           event.TripID,
			Reason:           string(event.Type),
			AffectedSegments: event.AffectedSegments,
		}); err != nil {
			var notFound *ErrTripNotFound
			if errors.As(err, &notFound) {
				msg.Ack()
				return
			}
			slog.Error("trigger replan error", "error", err)
			msg.Nack()
			return
		}
	}
	msg.Ack()
}
