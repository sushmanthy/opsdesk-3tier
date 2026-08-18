# OpsDesk — Three-Tier DevOps Application

OpsDesk is an engineering operations/ticket management application designed as a practical AWS/DevOps evaluation project.

## Architecture

Presentation tier: Nginx + HTML/CSS/JavaScript  
Application tier: Node.js + Express REST API  
Data tier: PostgreSQL

CRUD endpoints:
- GET /api/tickets
- GET /api/tickets/:id
- POST /api/tickets
- PUT /api/tickets/:id
- DELETE /api/tickets/:id
- GET /api/health

## Run locally

Prerequisites: Docker Desktop or Docker Engine + Compose.

```bash
git clone <your-github-repository>
cd opsdesk-3tier
docker compose up -d --build
```

Open http://localhost

Check:
```bash
docker compose ps
curl http://localhost/api/health
docker compose logs backend
```

## Git workflow

```bash
git checkout -b feature/ticket-crud
git add .
git commit -m "feat: build OpsDesk three-tier application"
git push -u origin feature/ticket-crud
```

Open a Pull Request, review it, then merge to main.

## Jenkins

The included Jenkinsfile checks out the repository, validates Docker Compose, builds the containers, starts the stack, tests the health endpoint, and deploys the stack.

For AWS, a production-style extension is:
- Jenkins on a dedicated EC2 instance
- Application tier on EC2
- PostgreSQL on Amazon RDS
- Docker images stored in Amazon ECR
- Nginx as the public entry point
- Security Groups limiting traffic between tiers

## Important

For an actual AWS deployment, do not use the demo database password from docker-compose. Store secrets in AWS Secrets Manager or SSM Parameter Store.
