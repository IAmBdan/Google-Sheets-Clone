## Project Overview
This is a collaborative spreadsheet application designed to allow multiple users to create, edit, and share spreadsheets in real-time. It consists of a server with a persistent store, a client for managing spreadsheets, and a user interface for editing and displaying sheets.

## Technologies Used
- We chose TypeScript and NextJS as it has strong computing power and smart resource handling, which helps our spreadsheets run smoothly even with lots of data. The intergration of Prisma into our repo allows us to have consistent type safety across the program, as well as seamless database schema editing and mock data entry. 

- Next.js
- Prisma
- React
- TypeScript
- PlanetScale

## Prerequisites
- Node.js
- npm or yarn
- PlanetScale account

## Installation 
Use the following commands with the Makefile:
- make install: Install dependencies (npm install)
- make build: Build the project (npm run build)
- make start: Start the server (npm run dev)
- make test: Run tests (npm test)

## Running the Project
To start the development server, run:
- npm run dev OR make start


## Classes

### cell.ts
The Cell class represents an individual cell in a spreadsheet.

Properties: value, ref, refAsString
Methods: Get/set value, references, and comparison with other cells.

### ref.ts
The Ref class represents a reference to a cell location.

Properties: column, row
Methods: Convert to string, get/set column/row, comparison with other references.

### sheet.ts
The Sheet class represents a spreadsheet.

Properties: cells, sheetTitle, publisher, sheetID, listeners
Methods: Get/set cell values, evaluate formulas, manage listeners, retrieve sheet size and title.

### sheetGraphManager.ts
The SheetGraphManager class manages the relationships between sheets and publishers.

Properties: sheets, publishers, sheetPublisherMap, sharedUsersMap
Methods: Add/remove sheets and publishers, manage shared users, retrieve sheets and publishers.


## API Routes Overview

We used husksheets server specifcation as a guideline for our server
https://docs.google.com/document/d/1lmZ38t138qlNYoICaZBOCGyA6eMRQ0MY1XGV3WJbKL0/edit?usp=sharing

Includes various API routes structured under `/api/v1/` for managing sheets and publishers, such as creating (`POST /createSheet`), fetching (`GET /getSheets`), updating (`PUT /updatePublished`), and deleting (`DELETE /deleteSheet`). Routes are accessed via standard HTTP methods and return appropriate status codes and responses. Authentication may be required for certain endpoints to ensure secure access.

## User Interface Overview

The user interface (UI) components in our project are structured according to their functionality and purpose. We have distinct components for different pages and layouts, each serving a specific role in the application.

__Login Page__: The login page component handles user authentication and login-related interactions. It ensures a smooth and secure login process for users accessing the application.

__Dashboard Page__: The dashboard page serves as a central hub, providing users with an overview of their sheets and access to key functionalities.

__Register Page__: The register page allows new users to sign up and create accounts, facilitating their entry into the platform. This page guides users through the registration process, ensuring a smooth and efficient onboarding experience.

__Sheet Page__: This component represents individual sheets within the application, allowing users to view, edit, and manipulate spreadsheet data. It provides a flexible interface for managing and analyzing data efficiently.

## Running Tests
__Test Framework__:
The tests for Husksheets are written using Jest.

__Test File Organization__:
The test files are located in the tests/ directory within the project.

__Running the Test Suite__:
To run the test suite, execute the following command in your terminal:
npm test



