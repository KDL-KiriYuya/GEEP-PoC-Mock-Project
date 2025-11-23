#!/bin/bash
# Format Python code with black and ruff

set -e

echo "Running ruff to fix auto-fixable issues..."
ruff check --fix app/

echo "Running black to format code..."
black app/

echo "✓ Code formatting complete!"
