#!/bin/bash
# Run linting and type checking

set -e

echo "Running ruff..."
ruff check app/

echo ""
echo "Running black check..."
black --check app/

echo ""
echo "Running mypy..."
mypy app/

echo ""
echo "✓ All checks passed!"
