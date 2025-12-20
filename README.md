# Developer Setup Guide for Onyx

This guide provides a reliable, error-free path to setting up the Onyx application stack.

## Prerequisites

* **Docker Desktop:** Ensure it is installed and running.
* **Git:** For cloning the repository.
* **System Resources:** We recommend assigning at least 8GB RAM to Docker.
* **Ports:** Ensure ports `3000` (Web) and `8080` (API) are free.

## 1. Setup

### Clone Repository
```bash
git clone  thiernope-onyx
cd thiernope-onyx
cd deployment/docker_compose
```

### Configure Environment

Create your environment file from the template:
```bash
cp env.template .env
```

## 2. Build and Run (Standard Method)

To avoid common Docker build errors, we follow a specific two-step launch process.

### Step 1: Build the Base Model Image

We build the `inference_model_server` first. This image is shared by multiple services, and building it explicitly prevents concurrency errors.

> **What is this?** The `inference_model_server` handles AI operations like embedding generation and re-ranking. It is a core component affecting search quality.
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml build inference_model_server
```

### Step 2: Start the Stack

Now, build and start the rest of the application.
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --remove-orphans
```

The application is now starting. This may take a few minutes as database migrations run.

## 3. Accessing the Application

* **Web UI:** http://localhost:3000/auth/login?admin=true
  * **Usage:** This is the main interface. Note: Public access is restricted. You must use the `?admin=true` parameter to access the login page.
* **API Server:** http://localhost:8080
  * **Usage:** The backend REST API. Useful for checking if the server is alive (health checks) or accessing auto-generated API documentation (usually at `/docs` or `/redoc`).
* **MinIO Console:** http://localhost:9005 (Login: `minioadmin` / `minioadmin`)
  * **Usage:** An S3-compatible object storage browser. Use this to verify that uploaded files, images, and indexed documents are correctly stored in the system buckets.

## 4. Configuration & Integration

After the containers are running, you must configure the integrations between Onyx and the Daxno Backend.

### 1. Create Admin Account

* Go to the restricted login page: http://localhost:3000/auth/login?admin=true
* Sign up to create the first account (this will be the Super Admin).

### 2. Generate API Key

The daxno-backend needs an API Key to auto-authenticate users in Onyx.

* In the Onyx UI, navigate to the Admin Panel.
* Go to API Keys (or User Management).
* Generate a new API Key.
* Copy this key.

### 3. Configure Backend Environment

Update your daxno-backend environment variables (usually in `.env`):
```bash
ONYX_API_KEY=your_generated_api_key_here
ONYX_DB_URL=postgresql://postgres:password@localhost:5435/postgres
GLOBAL_LLM_PROVIDER=openai  # or openrouter, etc.
GLOBAL_LLM_API_KEY=your_llm_provider_key
```

### 4. Run Scripts

Most configuration now happens automatically during backend startup!

**Automatic (Runs on `runserver.py` start):**

* `seed_onyx_groups.py`: Sets up User Groups (Free/Pro) and Token Rate Limits in the Onyx DB.
* `setup_onyx_global_llm.py`: Configures the default LLM provider (OpenAI, OpenRouter, etc.) using your env vars (`GLOBAL_LLM_PROVIDER`, `GLOBAL_LLM_API_KEY`).

## 5. Available Manual Scripts

The `daxno-backend/src/scripts` directory contains utilities you can run manually. Some require arguments.

**Usage:**
```bash
python3 src/scripts/ [arguments]
```

### Script Reference

| Script | Arguments | Description |
|--------|-----------|-------------|
| **Daxno Backend Operations** | | Scripts for managing the Wrapper application |
| `add_pro_transaction.py` | `<email>` | Interactive: Simulates a "Pro Plan" payment. Useful for testing tier logic without a real payment gateway. |
| `drop_db.py` | None | Dangerous: Drops all tables in the configured local DB. Use for valid resets. |
| `migrate_db.py` | None | Manually runs SQLAlchemy migrations (creation of tables). |
| **Onyx Integration & Debugging** | | Scripts for inspecting the Onyx instance |
| `check_llm.py` | None | Pings the Onyx DB to see if an LLM provider is configured. |
| `debug_onyx_user_state.py` | `[onyx_user_id]` | Deep dives into a user's permission groups and token usage history in Onyx. |
| `seed_onyx_groups.py` | None | Re-runs the group setup logic (Free/Pro tiers). Useful if you changed tier limits in `.env`. |
| `list_onyx_tables.py` | None | Dumps all table names from Onyx DB to verify connection and schema. |
| `test_onyx_connection.py` | None | Basic connectivity test to Onyx Postgres. |
| `verify_tier_assignment.py` | None | Audits if Daxno users are correctly mapped to Onyx groups. |
| `setup_onyx_global_llm.py` | None | Re-runs the LLM provider configuration. |
| `list_onyx_users.py` | None | Lists all user IDs and emails in the Onyx database. |
| `delete_onyx_user.py` | `<email>` | Danger: Permanently deletes a user from Onyx by email. |
| `check_user_role.py` | `<onyx_user_id>` | Checks the role (Admin/Basic) of an Onyx user by ID. |
| `fix_stale_tenants.py` | None | Clears "ghost" Onyx User IDs from local DB. Run this after a full reset. |

## 6. Management & Troubleshooting

### Restart vs Rebuild: A Quick Guide

Knowing when to restart vs rebuild saves time.

| Action | Command | When to use |
|--------|---------|-------------|
| **Restart** | `docker compose restart <service>` | **Runtime Config Changes:** You changed a `.env` var that backend reads at runtime.<br>**Stuck Service:** A service is hanging or unresponsive.<br>**Code Changes (Backend):** For Python code modifying files mounted via volumes (in dev). |
| **Rebuild** | `docker compose up -d --build <service>` | **Frontend Env Vars:** You changed a `NEXT_PUBLIC_` var (baked into build).<br>**Dependencies:** You changed `requirements.txt` or `package.json`.<br>**Dockerfile:** You modified the Dockerfile itself. |
| **Force Rebuild** | `... up -d --build --force-recreate --no-deps <service>` | **Stubborn Changes:** If a standard rebuild doesn't verify changes (e.g. cached build args).<br>`--no-deps`: Updates only this service without restarting its dependencies (faster). |

### Common Operations
```bash
# Restart All
docker compose -f docker-compose.yml -f docker-compose.dev.yml restart

# Rebuild Web Only
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build web_server

# Force Update Web
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --force-recreate --no-deps web_server

# Tear Down
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

### Deep Reset & Recovery

If you perform a full reset using `docker compose down -v` (which deletes the database volume), you MUST allow the backend to heal itself.

**Critical Steps after a `-v` reset:**

1. **Clear Stale IDs:** Your local backend knows about users that no longer exist in Onyx. You must clear these references so the system can recreate them.
```bash
   python3 src/scripts/fix_stale_tenants.py
```

2. **Generate New API Key:** The old `ONYX_API_KEY` in `.env` is invalid because the user it belonged to was deleted. Create a new Admin account and generate a new key.

3. **Restart Backend:** `python3 runserver.py` will automatically re-seed the "Pro Tier" groups and re-provision shadow users as they log in.

**Note on Ports:**

* The `onyx_db` container runs on port `5435` (mapped to host). Scripts must use `localhost:5435`.
* The `api_server` runs on port `8080`.
* The `daxno-backend` runs on port `8000`.

### Common Issues

**"Port already in use"**  
If you see `bind: address already in use`, another application is using port 3000 or 8080.

* **Fix:** Stop the other app, or edit `docker-compose.dev.yml` to map to a different local port (e.g., `"3001:3000"`).

### Logs

To see what's happening inside a container:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f api_server
```
