terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# --- Services ---

resource "google_project_service" "services" {
  for_each = toset([
    "run.googleapis.com",
    "firestore.googleapis.com",
    "aiplatform.googleapis.com",
    "pubsub.googleapis.com",
    "secretmanager.googleapis.com",
  ])
  service            = each.key
  disable_on_destroy = false
}

# --- Pub/Sub ---

resource "google_pubsub_topic" "disruption_events" {
  name       = "disruption-events"
  depends_on = [google_project_service.services]
}

resource "google_pubsub_subscription" "disruption_events_sub" {
  name  = "disruption-events-sub"
  topic = google_pubsub_topic.disruption_events.name

  push_config {
    push_endpoint = "${google_cloud_run_v2_service.realtime.uri}/push"
  }
}

# --- IAM Policy for Public Access ---

resource "google_cloud_run_v2_service_iam_member" "public_gateway" {
  name     = google_cloud_run_v2_service.gateway.name
  location = google_cloud_run_v2_service.gateway.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "public_frontend" {
  name     = google_cloud_run_v2_service.frontend.name
  location = google_cloud_run_v2_service.frontend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# --- Cloud Run Services ---

resource "google_cloud_run_v2_service" "frontend" {
  name     = "frontend-service"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "us-central1-docker.pkg.dev/gen-lang-client-0227574700/wayfinder-repo/frontend"
    }
  }
  depends_on = [google_project_service.services]
}

resource "google_cloud_run_v2_service" "gateway" {
  name     = "gateway-service"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "us-central1-docker.pkg.dev/gen-lang-client-0227574700/wayfinder-repo/gateway"
      env {
        name  = "PLANNER_URL"
        value = google_cloud_run_v2_service.planner.uri
      }
    }
  }
  depends_on = [google_project_service.services]
}

resource "google_cloud_run_v2_service" "planner" {
  name     = "planner-service"
  location = var.region

  template {
    containers {
      image = "us-central1-docker.pkg.dev/gen-lang-client-0227574700/wayfinder-repo/planner"
      resources {
        limits = {
          cpu    = "1"
          memory = "1Gi"
        }
      }
    }
  }
  depends_on = [google_project_service.services]
}

resource "google_cloud_run_v2_service" "realtime" {
  name     = "realtime-service"
  location = var.region

  template {
    containers {
      image = "us-central1-docker.pkg.dev/gen-lang-client-0227574700/wayfinder-repo/realtime"
      env {
        name  = "PLANNER_SERVICE_URL"
        value = google_cloud_run_v2_service.planner.uri
      }
      env {
        name  = "PROJECT_ID"
        value = var.project_id
      }
    }
  }

  depends_on = [google_project_service.services]
}

# --- Firestore (Native Mode) ---

resource "google_firestore_database" "database" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
  deletion_policy = "DELETE"
  depends_on  = [google_project_service.services]
}

output "frontend_url" {
  value = google_cloud_run_v2_service.frontend.uri
}
