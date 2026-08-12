#!/bin/sh
set -eu

password_file=${RESERVAS_E2E_DEMO_PASSWORD_FILE:-}
maestro_bin=${MAESTRO_BIN:-maestro}

if [ -z "${MAESTRO_DEMO_PASSWORD:-}" ]; then
  if [ -z "$password_file" ] || [ ! -r "$password_file" ]; then
    echo "Set MAESTRO_DEMO_PASSWORD or a readable RESERVAS_E2E_DEMO_PASSWORD_FILE." >&2
    exit 1
  fi
  IFS= read -r MAESTRO_DEMO_PASSWORD < "$password_file"
  export MAESTRO_DEMO_PASSWORD
fi
export MAESTRO_CLI_NO_ANALYTICS=1
export MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED=true
export MAESTRO_EXPECTED_PROFILE=${MAESTRO_EXPECTED_PROFILE:-LEGACY}

if [ -n "${MAESTRO_DEVICE_UDID:-}" ]; then
  exec "$maestro_bin" --device "$MAESTRO_DEVICE_UDID" test tests/e2e/seeded-ios.yaml
fi

exec "$maestro_bin" test tests/e2e/seeded-ios.yaml
