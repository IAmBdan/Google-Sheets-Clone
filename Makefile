# Author: Alan Zhang

# Variables
DATABASE_URL = mysql://jkici60lj45ssgs8rkmr:pscale_pw_iG2LjcCBBgQuVi57gqJpbxJCArbGRWlTIoOePBorp4X@aws.connect.psdb.cloud/computer-serve?sslaccept=strict

# Commands
START = npm run dev
BUILD = npm run build
TEST = npm test
INSTALL = npm install

# Targets
.PHONY: install start build test docker

help:
	@echo "Makefile for $(PROJECT_NAME)"
	@echo
	@echo "Usage:"
	@echo "  make install      Install dependencies"
	@echo "  make start        Start the development server"
	@echo "  make build        Build the project"
	@echo "  make test         Run tests"
	@echo "  make docker       Run tests inside a Docker container"

install:
	$(INSTALL)

start:
	$(START)

build:
	$(BUILD)

test:
	$(TEST)

docker:
	docker build -t computer-serve .
	docker run -p 3000:3000 computer-serve
