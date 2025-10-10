#!/usr/bin/env bash
# build.sh — Build & push a multi-platform Docker image with a version tag
# Usage: ./build.sh 1.0.0

set -euo pipefail

# Check that a version was provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

VERSION=$1
IMAGE_NAME="maxatanasov/postmark_mock"

echo "Building and pushing ${IMAGE_NAME}:${VERSION} for arm64 and amd64..."

docker buildx build \
  --push \
  --platform linux/arm64,linux/amd64 \
  -t "${IMAGE_NAME}:${VERSION}" \
  .

echo "✅ Successfully built and pushed ${IMAGE_NAME}:${VERSION}"
