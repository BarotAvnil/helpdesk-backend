# Helpdesk Backend API

A backend API for a company helpdesk system built with NestJS, TypeORM, and MySQL.

## Endpoints

### Auth

| Method | Endpoint       | Description    | Auth |
|--------|---------------|----------------|------|
| POST   | `/auth/login`  | Login and get JWT token | No |

### Users

| Method | Endpoint  | Description              | Auth / Role     |
|--------|----------|--------------------------|-----------------|
| POST   | `/users` | Create a new user        | MANAGER only    |
| GET    | `/users` | Get all users            | MANAGER only    |

### Tickets

| Method | Endpoint              | Description                      | Auth / Role           |
|--------|-----------------------|----------------------------------|-----------------------|
| POST   | `/tickets`            | Create a new ticket              | USER, MANAGER         |
| GET    | `/tickets`            | Get tickets (filtered by role)   | Authenticated         |
| PATCH  | `/tickets/:id/assign` | Assign ticket to someone         | MANAGER, SUPPORT      |
| PATCH  | `/tickets/:id/status` | Update ticket status             | MANAGER, SUPPORT      |
| DELETE | `/tickets/:id`        | Delete a ticket                  | MANAGER only          |

### Comments

| Method | Endpoint                          | Description                  | Auth / Role   |
|--------|-----------------------------------|------------------------------|---------------|
| POST   | `/tickets/:ticketId/comments`     | Add a comment to a ticket    | Authenticated |
| GET    | `/tickets/:ticketId/comments`     | Get comments for a ticket    | Authenticated |
| PATCH  | `/comments/:id`                   | Update a comment             | Owner/MANAGER |
| DELETE | `/comments/:id`                   | Delete a comment             | Owner/MANAGER |

### Health

| Method | Endpoint | Description       | Auth |
|--------|---------|-------------------|------|
| GET    | `/`     | Health check      | No   |

## Setup

```bash
npm install
npm run start:dev
```

Swagger docs available at `/api` when the server is running.
