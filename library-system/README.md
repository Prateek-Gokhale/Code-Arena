# 📚 Library Management System

A full-stack Library Management System built with **Java Spring Boot 3** + **React 18 + Vite + Tailwind CSS**.

---

## 🏗️ Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Backend   | Java 17, Spring Boot 3.2, Spring Security, JWT      |
| Database  | H2 (dev) / PostgreSQL (prod), Spring Data JPA       |
| API Docs  | Springdoc OpenAPI (Swagger UI)                      |
| Frontend  | React 18, Vite, Tailwind CSS, React Router v6       |
| Forms     | React Hook Form                                     |
| HTTP      | Axios with JWT interceptors                         |

---

## 🚀 Quick Start

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

## 🔐 Demo Credentials

| Role      | Email                    | Password    |
|-----------|--------------------------|-------------|
| Admin     | admin@library.com        | Admin@123   |
| Librarian | librarian@library.com    | Lib@123     |
| Member    | member@library.com       | Member@123  |

> Use the **Quick Login** buttons on the login page for instant access!

---

## 📡 API Endpoints

### Auth
```
POST /api/auth/login          → Login, returns JWT tokens
```

### Books
```
GET    /api/books             → List all books (paginated, searchable)
GET    /api/books/{id}        → Get book by ID
POST   /api/books             → Create book (ADMIN only)
PUT    /api/books/{id}        → Update book (ADMIN only)
DELETE /api/books/{id}        → Delete book (ADMIN only)
```

### Members
```
GET    /api/members           → List members (ADMIN/LIBRARIAN)
GET    /api/members/{id}      → Get member
POST   /api/members           → Create member (ADMIN)
PUT    /api/members/{id}      → Update member (ADMIN)
PATCH  /api/members/{id}/toggle-status → Toggle active status
```

### Borrows
```
GET  /api/borrows             → All borrow records
GET  /api/borrows/overdue     → Overdue borrows
GET  /api/borrows/user/{id}   → User's borrow history
POST /api/borrows/issue       → Issue book to member
POST /api/borrows/{id}/return → Return a book
POST /api/borrows/update-overdue → Refresh overdue statuses
```

### Dashboard
```
GET /api/dashboard/stats      → Statistics and reports
```

---

## 💡 Business Rules

| Rule               | Value                           |
|--------------------|---------------------------------|
| Default loan period | 14 days                        |
| Fine               | ₹5 per overdue day              |
| JWT expiry         | 24 hours (access), 7 days (refresh) |

---

## 🗂️ Project Structure

```
library-system/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/library/
│       ├── config/          # Security, JWT, OpenAPI, DataSeeder
│       ├── controller/      # REST controllers
│       ├── dto/             # Request/Response DTOs
│       ├── entity/          # JPA entities
│       ├── exception/       # Global error handling
│       ├── repository/      # Spring Data JPA repos
│       ├── service/impl/    # Business logic
│       └── util/            # JwtUtil
└── frontend/
    └── src/
        ├── api/             # Axios instance + API services
        ├── components/      # UI & layout components
        ├── features/auth/   # AuthContext
        ├── pages/           # Route-level pages
        └── routes/          # ProtectedRoute
```

---

## 🌐 Switch to PostgreSQL (Production)

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

## ✅ Features

- [x] JWT authentication with role-based access (Admin / Librarian / Member)
- [x] Full CRUD for Books with ISBN validation and copy tracking
- [x] Member management with activate/suspend
- [x] Book issue and return with automatic fine calculation (₹5/day)
- [x] Overdue tracking and fine management
- [x] Dashboard with stats, top borrowed books, overdue list
- [x] Paginated and searchable tables
- [x] Responsive UI (mobile + desktop)
- [x] Swagger UI for API documentation
- [x] H2 in-memory database with seed data
