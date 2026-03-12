# j.money
A web application to manage your personal finances

## Services

The project runs as 3 Docker services via `docker compose`:

- **`jmoney_db`**
  - MySQL database
  - Published port: `3306` (host) -> `3306` (container)
- **`jmoney_api`**
  - Flask API (listens on port `5065` inside the Docker network)
  - Not published to the host (the frontend dev server proxies to it internally)
- **`jmoney_web_dev`**
  - React dev server (CRA)
  - Published port: `3001` (host) -> `3000` (container)

### API routing

The dev server proxies API requests:

- `http://localhost:3001/api/...` -> `http://jmoney_api:5065/api/...`

See `web/package.json` (`proxy`).

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

- Web UI: `http://localhost:3001`

## Database readiness / first-boot reliability

- `jmoney_db` includes a Docker healthcheck so dependent services can wait until MySQL is responding.
- `jmoney_api` includes startup logic to wait for the database host/port to accept connections (controlled by `DB_WAIT_TIMEOUT`).

## Automated tests

Tests are located under `server/tests/` and use `pytest`.

### Run tests in Docker

The test config uses the MySQL hostname `jmoney_db`, so running tests in the Compose network is the most reliable option:

```sh
docker compose up -d --build jmoney_db
docker compose run --rm jmoney_api pytest -q
```

### Coverage

Generate a coverage report (recommended to run inside Docker):

```sh
docker compose up -d --build jmoney_db
docker compose run --rm jmoney_api pytest -q --cov=/app --cov-report=term-missing
```

Optionally generate an HTML report:

```sh
docker compose run --rm jmoney_api pytest -q --cov=/app --cov-report=html
```

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
