# ðŸ“š BookNest AI

A full-stack BookNest AI built with **Java Spring Boot 3** + **React 18 + Vite + Tailwind CSS**.

---

## ðŸ—ï¸ Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Backend   | Java 17, Spring Boot 3.2, Spring Security, JWT      |
| Database  | H2 (dev) / PostgreSQL (prod), Spring Data JPA       |
| API Docs  | Springdoc OpenAPI (Swagger UI)                      |
| Frontend  | React 18, Vite, Tailwind CSS, React Router v6       |
| Forms     | React Hook Form                                     |
| HTTP      | Axios with JWT interceptors                         |

---

## ðŸš€ Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.8+

---

### Backend Setup

```bash
cd backend
mvn spring-boot:run
```

The backend starts at **http://localhost:8080**

- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:librarydb`
  - Username: `sa` | Password: *(empty)*

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at **http://localhost:5173**

---

## ðŸ” Demo Credentials

| Role      | Email                    | Password    |
|-----------|--------------------------|-------------|
| Admin     | admin@library.com        | Admin@123   |
| Librarian | librarian@library.com    | Lib@123     |
| Member    | member@library.com       | Member@123  |

> Use the **Quick Login** buttons on the login page for instant access!

---

## ðŸ“¡ API Endpoints

### Auth
```
POST /api/auth/login          â†’ Login, returns JWT tokens
```

### Books
```
GET    /api/books             â†’ List all books (paginated, searchable)
GET    /api/books/{id}        â†’ Get book by ID
POST   /api/books             â†’ Create book (ADMIN only)
PUT    /api/books/{id}        â†’ Update book (ADMIN only)
DELETE /api/books/{id}        â†’ Delete book (ADMIN only)
```

### Members
```
GET    /api/members           â†’ List members (ADMIN/LIBRARIAN)
GET    /api/members/{id}      â†’ Get member
POST   /api/members           â†’ Create member (ADMIN)
PUT    /api/members/{id}      â†’ Update member (ADMIN)
PATCH  /api/members/{id}/toggle-status â†’ Toggle active status
```

### Borrows
```
GET  /api/borrows             â†’ All borrow records
GET  /api/borrows/overdue     â†’ Overdue borrows
GET  /api/borrows/user/{id}   â†’ User's borrow history
POST /api/borrows/issue       â†’ Issue book to member
POST /api/borrows/{id}/return â†’ Return a book
POST /api/borrows/update-overdue â†’ Refresh overdue statuses
```

### Dashboard
```
GET /api/dashboard/stats      â†’ Statistics and reports
```

---

## ðŸ’¡ Business Rules

| Rule               | Value                           |
|--------------------|---------------------------------|
| Default loan period | 14 days                        |
| Fine               | â‚¹5 per overdue day              |
| JWT expiry         | 24 hours (access), 7 days (refresh) |

---

## ðŸ—‚ï¸ Project Structure

```
library-system/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ pom.xml
â”‚   â””â”€â”€ src/main/java/com/library/
â”‚       â”œâ”€â”€ config/          # Security, JWT, OpenAPI, DataSeeder
â”‚       â”œâ”€â”€ controller/      # REST controllers
â”‚       â”œâ”€â”€ dto/             # Request/Response DTOs
â”‚       â”œâ”€â”€ entity/          # JPA entities
â”‚       â”œâ”€â”€ exception/       # Global error handling
â”‚       â”œâ”€â”€ repository/      # Spring Data JPA repos
â”‚       â”œâ”€â”€ service/impl/    # Business logic
â”‚       â””â”€â”€ util/            # JwtUtil
â””â”€â”€ frontend/
    â””â”€â”€ src/
        â”œâ”€â”€ api/             # Axios instance + API services
        â”œâ”€â”€ components/      # UI & layout components
        â”œâ”€â”€ features/auth/   # AuthContext
        â”œâ”€â”€ pages/           # Route-level pages
        â””â”€â”€ routes/          # ProtectedRoute
```

---

## ðŸŒ Switch to PostgreSQL (Production)

Update `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/library_db
    username: your_user
    password: your_password
    driver-class-name: org.postgresql.Driver
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: update
```

---

## âœ… Features

- [x] JWT authentication with role-based access (Admin / Librarian / Member)
- [x] Full CRUD for Books with ISBN validation and copy tracking
- [x] Member management with activate/suspend
- [x] Book issue and return with automatic fine calculation (â‚¹5/day)
- [x] Overdue tracking and fine management
- [x] Dashboard with stats, top borrowed books, overdue list
- [x] Paginated and searchable tables
- [x] Responsive UI (mobile + desktop)
- [x] Swagger UI for API documentation
- [x] H2 in-memory database with seed data

