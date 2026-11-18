.PHONY: up down logs restart clean dev build

up:
	docker compose up -d --build
	sleep 5
	npm run dev

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

e2e:
	docker compose up -d wiremock
	npm run test:e2e

e2e-ui:
	docker compose up -d wiremock
	npm run test:e2e:ui

e2e-debug:
	docker compose up -d wiremock
	npm run test:e2e:debug
