output "gateway_url" {
  description = "URL of the API Gateway Cloud Run service"
  value       = google_cloud_run_v2_service.gateway.uri
}

output "planner_url" {
  description = "URL of the Planner Cloud Run service"
  value       = google_cloud_run_v2_service.planner.uri
}

output "realtime_url" {
  description = "URL of the Realtime Cloud Run service"
  value       = google_cloud_run_v2_service.realtime.uri
}
