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
	npm run build-storybook
	@npx http-server storybook-static -p 6011 -s > /tmp/sb-e2e-server.log 2>&1 & \
	SERVER_PID=$$!; \
	sleep 3; \
	npx test-storybook --url http://localhost:6011; \
	STATUS=$$?; \
	kill $$SERVER_PID 2>/dev/null; \
	exit $$STATUS

e2e-ui:
	docker compose up -d wiremock
	npm run test:e2e:ui

e2e-debug:
	docker compose up -d wiremock
	npm run test:e2e:debug
