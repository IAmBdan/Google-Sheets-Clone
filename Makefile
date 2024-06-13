# Variables
DATABASE_URL = mysql://jkici60lj45ssgs8rkmr:pscale_pw_iG2LjcCBBgQuVi57gqJpbxJCArbGRWlTIoOePBorp4X@aws.connect.psdb.cloud/computer-serve?sslaccept=strict
DOCKER_IMAGE = nextjs-app-image

# Commands
START = docker run --rm $(DOCKER_IMAGE) npm run dev
BUILD = docker build -t $(DOCKER_IMAGE) .
TEST = docker run --rm $(DOCKER_IMAGE) npm test
INSTALL = docker run --rm $(DOCKER_IMAGE) npm install
 
# Targets
.PHONY: install start build test

help:
	@echo "Makefile for $(PROJECT_NAME)"
	@echo
	@echo "Usage:"
	@echo "  make install      Install dependencies"
	@echo "  make start        Start the development server"
	@echo "  make build        Build the project"
	@echo "  make test         Run tests"
 
install:
	$(INSTALL)
 
start:
	$(START)
 
build:
	$(BUILD)
 
test:
	$(TEST)

	