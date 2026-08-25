#!/usr/bin/env bash
#
# setup_neersurakhsha.sh
#
# Scaffolds the NeerSurakhsha project: an Expo (React Native) field app
# repo and a FastAPI backend repo, matching PROJECT_STRUCTURE.md and
# ANTIGRAVITY_CONTEXT.md.
#
# Usage:
#   ./setup_neersurakhsha.sh [target_dir]
#
#   target_dir   optional. Defaults to the current directory.
#                Two folders are created inside it:
#                  neersurakhsha-app/
#                  neersurakhsha-backend/
#
# Safe to re-run: existing files/folders are left untouched (mkdir -p,
# and files are only created if they don't already exist).

set -euo pipefail

TARGET_DIR="${1:-.}"
APP_ROOT="${TARGET_DIR}/neersurakhsha-app"
BACKEND_ROOT="${TARGET_DIR}/neersurakhsha-backend"

log() { printf '  \033[36m·\033[0m %s\n' "$1"; }
section() { printf '\n\033[1m%s\033[0m\n' "$1"; }

# make_dir: mkdir -p with a log line
make_dir() {
  mkdir -p "$1"
  log "dir  $1"
}

# make_file: touch a file only if it doesn't exist, with optional starter content
make_file() {
  local path="$1"
  local content="${2:-}"
  if [ -e "$path" ]; then
    log "skip $path (already exists)"
    return
  fi
  mkdir -p "$(dirname "$path")"
  if [ -n "$content" ]; then
    printf '%s\n' "$content" > "$path"
  else
    : > "$path"
  fi
  log "file $path"
}

# ---------------------------------------------------------------------------
section "1/2 — Scaffolding neersurakhsha-app (Expo)"
# ---------------------------------------------------------------------------

APP_DIRS=(
  "app/(onboarding)"
  "app/(tabs)/alerts"
  "app/health-report"
  "app/water-test"
  "app/groundwater"
  "app/source"
  "app/recommendation"
  "app/qr-scanner"
  "app/awareness"
  "app/profile"
  "components/common"
  "components/health"
  "components/water"
  "components/groundwater"
  "components/map"
  "components/alerts"
  "services/api"
  "services/database"
  "services/sync"
  "services/location"
  "services/camera"
  "services/notifications"
  "store"
  "hooks"
  "types"
  "constants"
  "utils"
  "theme"
  "locales"
  "assets/icons"
  "assets/images"
  "assets/audio"
)
for d in "${APP_DIRS[@]}"; do
  make_dir "${APP_ROOT}/${d}"
done

APP_FILES=(
  "app/_layout.tsx"
  "app/splash.tsx"
  "app/(onboarding)/language.tsx"
  "app/(onboarding)/login.tsx"
  "app/(tabs)/_layout.tsx"
  "app/(tabs)/home.tsx"
  "app/(tabs)/map.tsx"
  "app/(tabs)/sync.tsx"
  "app/(tabs)/alerts/index.tsx"
  "app/(tabs)/alerts/[alertId].tsx"
  "app/health-report/index.tsx"
  "app/health-report/select-source.tsx"
  "app/water-test/index.tsx"
  "app/groundwater/index.tsx"
  "app/source/[sourceId].tsx"
  "app/recommendation/[sourceId].tsx"
  "app/qr-scanner/index.tsx"
  "app/awareness/index.tsx"
  "app/awareness/[topicId].tsx"
  "app/profile/index.tsx"
  "services/api/client.ts"
  "services/api/health.service.ts"
  "services/api/water.service.ts"
  "services/api/groundwater.service.ts"
  "services/api/source.service.ts"
  "services/api/advisory.service.ts"
  "services/database/sqlite.ts"
  "services/database/migrations.ts"
  "services/database/health.repository.ts"
  "services/database/water.repository.ts"
  "services/database/groundwater.repository.ts"
  "services/database/sync.repository.ts"
  "services/sync/sync.queue.ts"
  "services/sync/sync.service.ts"
  "services/sync/network.service.ts"
  "services/location/location.service.ts"
  "services/camera/camera.service.ts"
  "services/notifications/notification.service.ts"
  "store/auth.store.ts"
  "store/health.store.ts"
  "store/water.store.ts"
  "store/groundwater.store.ts"
  "store/source.store.ts"
  "store/sync.store.ts"
  "hooks/useNetwork.ts"
  "hooks/useOfflineSync.ts"
  "hooks/useLocation.ts"
  "hooks/useCamera.ts"
  "hooks/useLanguage.ts"
  "types/health.ts"
  "types/water.ts"
  "types/groundwater.ts"
  "types/source.ts"
  "types/vwsi.ts"
  "types/advisory.ts"
  "constants/colors.ts"
  "constants/symptoms.ts"
  "constants/languages.ts"
  "constants/config.ts"
  "utils/validation.ts"
  "utils/date.ts"
  "utils/format.ts"
  "utils/vwsi.ts"
  "theme/colors.ts"
  "theme/spacing.ts"
  "theme/typography.ts"
  "theme/index.ts"
  "locales/en.json"
  "locales/hi.json"
  "locales/as.json"
  "locales/brx.json"
  "locales/kha.json"
  "locales/lus.json"
  "locales/mni.json"
  "locales/nsm.json"
)
for f in "${APP_FILES[@]}"; do
  make_file "${APP_ROOT}/${f}"
done

make_file "${APP_ROOT}/.env.example" "EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1"
make_file "${APP_ROOT}/.env" "EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1"
make_file "${APP_ROOT}/app.json" '{
  "expo": {
    "name": "NeerSurakhsha",
    "slug": "neersurakhsha"
  }
}'
make_file "${APP_ROOT}/eas.json" '{
  "cli": { "version": ">= 5.0.0" },
  "build": { "development": {}, "preview": {}, "production": {} }
}'
make_file "${APP_ROOT}/package.json" '{
  "name": "neersurakhsha-app",
  "version": "0.1.0",
  "private": true
}'
make_file "${APP_ROOT}/tsconfig.json" '{
  "extends": "expo/tsconfig.base",
  "compilerOptions": { "strict": true }
}'
make_file "${APP_ROOT}/README.md" "# NeerSurakhsha — Field App

Expo/React Native field app for ASHA/community workers. See
ANTIGRAVITY_CONTEXT.md and PROJECT_STRUCTURE.md at the repo root for full
project context."

# ---------------------------------------------------------------------------
section "2/2 — Scaffolding neersurakhsha-backend (FastAPI)"
# ---------------------------------------------------------------------------

BACKEND_DIRS=(
  "app/api/v1"
  "app/core"
  "app/models"
  "app/schemas"
  "app/engines"
  "app/services"
  "app/repositories"
  "app/tasks"
  "app/utils"
  "alembic/versions"
  "tests"
)
for d in "${BACKEND_DIRS[@]}"; do
  make_dir "${BACKEND_ROOT}/${d}"
done

BACKEND_FILES=(
  "app/__init__.py"
  "app/main.py"
  "app/api/__init__.py"
  "app/api/v1/__init__.py"
  "app/api/v1/router.py"
  "app/api/v1/auth.py"
  "app/api/v1/health_reports.py"
  "app/api/v1/water_tests.py"
  "app/api/v1/groundwater.py"
  "app/api/v1/sources.py"
  "app/api/v1/alerts.py"
  "app/api/v1/advisories.py"
  "app/api/v1/sync.py"
  "app/core/__init__.py"
  "app/core/config.py"
  "app/core/security.py"
  "app/core/database.py"
  "app/models/__init__.py"
  "app/models/user.py"
  "app/models/health_report.py"
  "app/models/water_test.py"
  "app/models/groundwater_reading.py"
  "app/models/water_source.py"
  "app/models/alert.py"
  "app/schemas/__init__.py"
  "app/schemas/user.py"
  "app/schemas/health_report.py"
  "app/schemas/water_test.py"
  "app/schemas/groundwater_reading.py"
  "app/schemas/water_source.py"
  "app/schemas/alert.py"
  "app/engines/__init__.py"
  "app/engines/health_engine.py"
  "app/engines/aquifer_engine.py"
  "app/engines/vwsi_engine.py"
  "app/engines/decision_engine.py"
  "app/services/__init__.py"
  "app/services/dwlr_ingestion.py"
  "app/services/water_quality_ingestion.py"
  "app/services/spatial_interpolation.py"
  "app/services/sms_ivr_gateway.py"
  "app/services/notification_service.py"
  "app/repositories/__init__.py"
  "app/repositories/health_repository.py"
  "app/repositories/water_repository.py"
  "app/repositories/groundwater_repository.py"
  "app/repositories/source_repository.py"
  "app/repositories/alert_repository.py"
  "app/tasks/__init__.py"
  "app/tasks/dwlr_poll.py"
  "app/tasks/vwsi_recompute.py"
  "app/tasks/alert_dispatch.py"
  "app/utils/__init__.py"
  "app/utils/validation.py"
  "app/utils/geo.py"
  "alembic/env.py"
  "tests/__init__.py"
  "tests/test_health_engine.py"
  "tests/test_aquifer_engine.py"
  "tests/test_vwsi_engine.py"
  "tests/test_sync_api.py"
)
for f in "${BACKEND_FILES[@]}"; do
  make_file "${BACKEND_ROOT}/${f}"
done

make_file "${BACKEND_ROOT}/requirements.txt" "fastapi
uvicorn[standard]
sqlalchemy
alembic
psycopg2-binary
geoalchemy2
pydantic-settings
python-jose[cryptography]
passlib[bcrypt]
python-multipart"
make_file "${BACKEND_ROOT}/.env.example" "DATABASE_URL=postgresql://postgres:postgres@db:5432/neersurakhsha
SECRET_KEY=change-me
DWLR_TELEMETRY_TOKEN=change-me"
make_file "${BACKEND_ROOT}/docker-compose.yml" "version: \"3.9\"
services:
  api:
    build: .
    ports:
      - \"8000:8000\"
    env_file: .env
    depends_on:
      - db
  db:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: neersurakhsha
      POSTGRES_PASSWORD: postgres
    ports:
      - \"5432:5432\""
make_file "${BACKEND_ROOT}/README.md" "# NeerSurakhsha — Backend

FastAPI + PostgreSQL/PostGIS backend: ingestion, engines (health/aquifer/VWSI),
decision layer, and alert dispatch. See ANTIGRAVITY_CONTEXT.md and
PROJECT_STRUCTURE.md at the repo root for full project context."

# ---------------------------------------------------------------------------
section "Done"
# ---------------------------------------------------------------------------
echo "Created:"
echo "  ${APP_ROOT}"
echo "  ${BACKEND_ROOT}"
echo
echo "Next steps:"
echo "  cd ${APP_ROOT} && npx create-expo-app@latest . --template   # if package.json is still a stub"
echo "  cd ${BACKEND_ROOT} && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
