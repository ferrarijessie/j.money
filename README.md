# j.money
A web application to manage your personal finances

## Services

The project runs as 3 Docker services via `docker compose`:

- **`jmoney_db`**
  - MySQL database
  - Published port: `3306` (host) -> `3306` (container)
- **`jmoney_api`**
  - Flask API (listens on port `5065` inside the Docker network)
  - Not published to the host (Nginx proxies to it internally)
- **`jmoney_web`**
  - Nginx serving the web UI
  - Published port: `3000` (host) -> `80` (container)

### API routing

The web container proxies API requests:

- `http://localhost:3000/api/...` -> `http://jmoney_api:5065/api/...`

See `web/nginx.conf`.

## Configuration (.env)

Runtime configuration is provided via environment variables.

1) Copy the example env file:

```sh
cp .env.example .env
```

2) Edit `.env` as needed.

Required variables (see `.env.example`):

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE`
- `DATABASE_URL` (optional) OR the set of:
  - `DATABASE_USER`
  - `DATABASE_PASSWORD`
  - `DATABASE_HOST`
  - `DATABASE_PORT`
  - `DATABASE_NAME`
- `DB_WAIT_TIMEOUT` (optional)

## Running

Build and start everything:

```sh
docker compose up -d --build
```

Open:

- Web UI: `http://localhost:3000`

## Database readiness / first-boot reliability

- `jmoney_db` includes a Docker healthcheck so dependent services can wait until MySQL is responding.
- `jmoney_api` includes startup logic to wait for the database host/port to accept connections (controlled by `DB_WAIT_TIMEOUT`).

## Troubleshooting

### API container restarting with a DB env error

If `jmoney_api` logs show:

```text
RuntimeError: DATABASE_USER and DATABASE_PASSWORD must be set (or provide DATABASE_URL).
```

Confirm:

- `.env` exists in the same directory as `docker-compose.yml`.
- `.env` contains either a non-empty `DATABASE_URL` or both `DATABASE_USER` and `DATABASE_PASSWORD`.
- You recreated the container after changing env vars:

```sh
docker compose up -d --build --force-recreate
```
