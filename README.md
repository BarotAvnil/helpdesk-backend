Helpdesk Backend API

This is a backend project for a Helpdesk Ticket Management System. It is built using NestJS API.

Requirements:

Node.js (v18+)
MySQL
npm

Setup Process:

Download the code First, download or clone the project to your computer.

Install the dependencies:
npm install

Set up your .env file with database credentials.

Then run the server:
npm run start:dev

API Endpoints:

1. POST /auth/login — Login
   Body: { "email": "admin@helpdesk.com", "password": "admin123" }

2. POST /users — Create a new user (MANAGER only)
   Body: { "name": "John Doe", "email": "john@helpdesk.com", "password": "password123", "role": "SUPPORT" }
   Roles can be: MANAGER, SUPPORT, USER

3. GET /users — Get all users (MANAGER only)

4. POST /tickets — Create a new ticket
   Body: { "title": "Laptop not booting", "description": "My office laptop does not start after update", "priority": "MEDIUM" }
   Priority can be: LOW, MEDIUM, HIGH

5. GET /tickets — Get all tickets (filtered by user role)

6. PATCH /tickets/:id/assign — Assign a ticket to someone
   Body: { "userId": 2 }

7. PATCH /tickets/:id/status — Update ticket status
   Body: { "status": "IN_PROGRESS" }
   Status can be: OPEN, IN_PROGRESS, RESOLVED, CLOSED

8. DELETE /tickets/:id — Delete a ticket (MANAGER only)

9. POST /tickets/:ticketId/comments — Add a comment to a ticket
   Body: { "comment": "We are checking the issue" }

10. GET /tickets/:ticketId/comments — Get comments for a ticket

11. PATCH /comments/:id — Update a comment
    Body: { "comment": "Updated comment text" }

12. DELETE /comments/:id — Delete a comment

Swagger docs are available at /api when the server is running.
