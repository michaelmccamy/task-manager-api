# Task Manager API

Simple REST API for managing tasks built using Java and Spring Boot.

## Features
- Create, read, update, and delete (CRUD) tasks
- Stores data in PostgreSQL, can be modified for MySQL
- Tested with Postman

## Software
- Java 17
- Spring Boot
- PostgreSQL
- Gradle

## How to Run
1. Clone the repo
2. Update src/main/resources/application.properties with your PostgreSQL username and password
3. Start the backend:
```bash
./gradlew bootRun
```
4. To start the frontend:
```bash
cd frontend
npm install
npm run dev
```
