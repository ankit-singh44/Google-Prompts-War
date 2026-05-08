# Wayfinder AI 🌍✨
> "The trip that thinks for itself."

Wayfinder AI is an AI-native travel co-pilot that dynamically generates, adapts, and personalizes itineraries. Unlike static planners, Wayfinder AI understands mood, continuously learns your preferences, and proactively replans segments in real-time when disruptions occur.

## Architecture

![Architecture](https://via.placeholder.com/800x400?text=WayfinderAI+Architecture)

- **Frontend**: Next.js 15 (App Router), Tailwind CSS
- **API Gateway**: Node.js + Fastify, Firebase Auth middleware
- **Planner Service**: Python + FastAPI, Vertex AI integration (Gemini 2.0)
- **Real-time Service**: Go, Cloud Pub/Sub disruption pipeline
- **Infrastructure**: Terraform

## Local Development

### Prerequisites
- Node.js (v20+)
- Python (3.9+)
- Go (1.21+)
- Terraform (1.5+)

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. API Gateway
```bash
cd services/gateway
npm install
# npm run dev or node server.js
node server.js
```

### 3. Planner Service
```bash
cd services/planner
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Real-time Service
```bash
cd services/realtime
go run main.go
```

## GCP Deployment (Terraform)
All infrastructure is defined as Code (IaC) using Terraform.

```bash
cd infra/terraform
terraform init
terraform apply -var="project_id=YOUR_PROJECT_ID"
```

*Note: After deployment, store your API keys in Secret Manager.*

## Cost Estimate (Demo Scale)
- **Cloud Run (3 instances)**: $0 (Free Tier)
- **Firestore**: $0 (Free Tier)
- **Vertex AI**: < $0.05 (Per-token generation)
- **Pub/Sub**: $0 (Free Tier)
- **Total**: < $1/month
