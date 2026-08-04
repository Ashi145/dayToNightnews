#!/usr/bin/env bash
set -euo pipefail

echo "==> Building production bundle"
rm -rf .next
npm run build

echo "==> Assembling standalone output"
mkdir -p .next/standalone/.next .next/standalone/public
cp -r .next/static .next/standalone/.next/static
if [ -d public ] && [ "$(ls -A public 2>/dev/null)" ]; then
  cp -r public/. .next/standalone/public/
fi

echo "==> Creating daytonight-deploy.zip"
rm -f /tmp/opencode/daytonight-deploy.zip
(cd .next/standalone && zip -rq /tmp/opencode/daytonight-deploy.zip .)

echo "==> Done: /tmp/opencode/daytonight-deploy.zip"
ls -lh /tmp/opencode/daytonight-deploy.zip
