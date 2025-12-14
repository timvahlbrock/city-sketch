#!/bin/bash
# from https://github.com/get-convex/convex-backend/issues/128
set -e
output=$(node ./github/ci-support/generateKeys.mjs)

JWT_PRIVATE_KEY=$(echo "$output" | sed -n 's/^JWT_PRIVATE_KEY="\([^"]*\)"/\1/p')
JWKS=$(echo "$output" | sed -n 's/^JWKS=\(.*\)/\1/p')

ENV_CMD="npx convex env set"

# configure other env vars here as such
# $ENV_CMD -- MAX_USERS 1 >/dev/null

# auth will fail if these are not set
if ! $ENV_CMD -- JWT_PRIVATE_KEY "$JWT_PRIVATE_KEY" >/dev/null; then
  echo "Failed to set JWT_PRIVATE_KEY"
  exit 1;
fi
if ! $ENV_CMD -- JWKS "$JWKS" >/dev/null; then
  echo "Failed to set JWKS"
  exit 1;
fi