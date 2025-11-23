.PHONY: install format lint type-check test clean help

help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make install-dev  - Install development dependencies"
	@echo "  make format       - Format code with black and ruff"
	@echo "  make lint         - Run ruff linter"
	@echo "  make type-check   - Run mypy type checker"
	@echo "  make check        - Run all checks (lint + type-check)"
	@echo "  make clean        - Remove cache files"

install:
	pip install -r requirements.txt

install-dev:
	pip install -r requirements.txt
	pip install -r requirements-dev.txt

format:
	@echo "Running ruff to fix auto-fixable issues..."
	ruff check --fix app/
	@echo "Running black to format code..."
	black app/
	@echo "✓ Code formatting complete!"

lint:
	@echo "Running ruff..."
	ruff check app/

type-check:
	@echo "Running mypy..."
	mypy app/

check: lint type-check
	@echo "✓ All checks passed!"

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	@echo "✓ Cache files removed!"
