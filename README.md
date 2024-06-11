# Husksheets

## Project Overview
Husksheets is a collaborative spreadsheet application designed to allow multiple users to create, edit, and share spreadsheets in real-time. The project consists of a server with a persistent store, a client for managing spreadsheets, and a user interface for editing and displaying sheets.

## Technologies Used
- T3 Stack
  - Next.js
  - tRPC
  - Prisma
- React
- TypeScript
- PlanetScale

## Getting Started 

## Prerequisites
- Node.js
- npm or yarn
- PlanetScale account

## Installation 
|
|
|
|
|
|
|


## Running the Project
To start the development server, run:
- npm run dev


## Classes

## cell.ts
The Cell class represents an individual cell in a spreadsheet.

Properties: value, ref, refAsString
Methods: Get/set value, references, and comparison with other cells.

## ref.ts
The Ref class represents a reference to a cell location.

Properties: column, row
Methods: Convert to string, get/set column/row, comparison with other references.

## sheet.ts
The Sheet class represents a spreadsheet.

Properties: cells, sheetTitle, publisher, sheetID, listeners
Methods: Get/set cell values, evaluate formulas, manage listeners, retrieve sheet size and title.

## sheetGraphManager.ts
The SheetGraphManager class manages the relationships between sheets and publishers.

Properties: sheets, publishers, sheetPublisherMap, sharedUsersMap
Methods: Add/remove sheets and publishers, manage shared users, retrieve sheets and publishers.

## publisher.ts
The Publisher class represents the publisher of a sheet.

Properties:
- Add properties and methods as defined in your actual Publisher class implementation.





