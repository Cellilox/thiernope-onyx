# Developer Setup Guide for Onyx

This guide provides step-by-step instructions for developers to set up and run the Onyx application stack using Docker Compose.

## Prerequisites

Ensure you have the following installed on your machine:

* Docker Engine and Docker Compose (included with Docker Desktop)
* Git
* Recommended: 8GB+ RAM assigned to Docker

## 1. Clone the Repository

Clone the full repository to your local machine:
```bash
git clone <repository-url> thiernope-onyx
cd thiernope-onyx
```

## 2. Environment Configuration

Navigate to the `deployment/docker_compose` directory, which contains the container configurations:
```bash
cd deployment/docker_compose
```

Create your local environment file by copying the template:
```bash
cp env.template .env
```

> **TIP:** You can leave the default values in `.env` for a standard local development setup. If you need to customize authentication or external keys (like OpenAI), edit `.env` now.

## 3. Running the Containers

For development, you likely want to run the full stack (Frontend, Backend, DB, etc.) and expose ports for local access. We use `docker-compose.dev.yml` to override default settings and expose ports (e.g., Frontend on 3000, Backend on 8080).

### Start the Stack

Run the following command to build and start the containers in the background:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --remove-orphans
```

* `-f docker-compose.yml`: Uses the base service definitions
* `-f docker-compose.dev.yml`: Adds development overrides (exposes ports)
* `--build`: Forces a rebuild of images from your local source code (essential if you are modifying code)
* `-d`: Detached mode (runs in background)

### Stop the Stack

To stop the containers:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

To stop and remove all data (clean slate):
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

## 4. Accessing the Application

Once running, access the services at:

* **Web UI:** http://localhost:3000
* **API Server:** http://localhost:8080
* **Postgres DB:** Port `5435` (mapped from 5432)
* **MinIO (S3):** Port `9004` (Console: `9005`)

## 5. Troubleshooting / Notes

* **Initial Startup Time:** The first startup may take a few minutes as database migrations run and models download.
* **Nginx Errors:** If Nginx crashes with "host not found", it usually means the `api_server` or `web_server` isn't ready yet. It will auto-restart until they are up.
* **Rebuilding:** If you change `backend` or `web` code, remember to run `docker compose ... up -d --build` to apply changes.
* **Logs:** View logs for a specific service (e.g., api_server) with:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f api_server
```
