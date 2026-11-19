.PHONY: up down logs restart clean dev build test e2e e2e-ui e2e-debug e2e-prepare

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

restart:
	docker compose restart

clean:
	docker compose down -v --rmi local

dev:
	docker compose up -d wiremock
	npm run dev

build:
	docker compose build

test:
	npm run test

# Free :3000 so Playwright boots its own dev server with API_CHAOS=false
# (it reuses an existing server otherwise, inheriting whatever env it has)
e2e-prepare:
	docker compose up -d wiremock
	-lsof -ti:3000 | xargs kill

e2e: e2e-prepare
	npm run test:e2e

e2e-ui: e2e-prepare
	npm run test:e2e:ui

e2e-debug: e2e-prepare
	npm run test:e2e:debug
