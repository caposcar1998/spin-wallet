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
	sleep 5
	npm run dev

build:
	docker compose build
