# Pearls: Task Management Application

A full-stack web application for organizing, tracking, and managing tasks — built with ASP.NET Core and React.js.

---

## Overview

This project was developed during the 10Pearls .NET Fullstack Internship. It implements a complete task management system with user authentication, role-based authorization, and full CRUD operations for tasks with categorization and priority management.

The backend is built on ASP.NET Core 8.0 with Entity Framework Core for data persistence. The frontend uses React.js with TypeScript and Tailwind CSS for a modern, responsive interface.

---

## Key Features

- User registration and login with JWT token-based authentication
- Role-based access control (Admin and User roles)
- Full CRUD operations for tasks
- Task categorization, priority levels, and status tracking (Pending, In Progress, Completed)
- Soft delete support via IsActive flag
- Admin dashboard with system-wide task visibility
- Personal task dashboard for regular users

---

## Technology Stack

**Backend**
- Framework: ASP.NET Core 8.0
- Database: SQL Server
- ORM: Entity Framework Core 8.0.14
- Authentication: JWT with Bearer scheme, ASP.NET Core Identity
- Object Mapping: AutoMapper 12.0.0
- API Documentation: Swagger/OpenAPI
- Architecture: Repository Pattern

**Frontend**
- Library: React.js 19.0.0
- Language: TypeScript 5.7.2
- Build Tool: Vite 6.2.0
- Routing: React Router 7.4.0
- UI Framework: Tailwind CSS 4.0.15 + Radix UI
- Form Handling: React Hook Form 7.54.2
- Validation: Zod 3.24.2

---

## Project Structure

```
task-management-app/
|
|-- task_management.Server/                 # Backend (ASP.NET Core)
|   |-- Controllers/
|   |   |-- AuthController.cs              # Authentication endpoints
|   |   |-- TaskController.cs              # Task management endpoints
|   |   |-- UserController.cs              # User management endpoints
|   |
|   |-- Models/
|   |   |-- ApplicationUser.cs             # Extended Identity user
|   |   |-- Task.cs                        # Task entity
|   |   |-- TaskStatus.cs                  # Task status reference
|   |   |-- TaskCategory.cs                # Task category reference
|   |
|   |-- Repository/
|   |   |-- AuthRepository.cs              # Auth data operations
|   |   |-- TaskRepository.cs              # Task data operations
|   |   |-- UserRepository.cs              # User data operations
|   |   |-- JwtTokenGenerator.cs           # JWT token generation
|   |
|   |-- Contracts/                         # Repository interfaces
|   |-- Dto/                               # Data transfer objects
|   |-- Data/
|   |   |-- AppDbContext.cs                # Entity Framework DbContext
|   |
|   |-- Migrations/                        # EF Core migrations
|   |-- appsettings.json                   # Configuration file
|   |-- MapperConfig.cs                    # AutoMapper configuration
|   |-- Program.cs                         # Application startup
|
|-- task_management.client/                 # Frontend (React + TypeScript)
|   |-- src/
|   |   |-- pages/
|   |   |   |-- AuthPage.tsx               # Authentication page
|   |   |   |-- Home.tsx                   # Landing page
|   |   |   |-- User/
|   |   |   |   |-- UserHome.tsx           # User task dashboard
|   |   |   |   |-- CreateTaskPage.tsx     # Create task form
|   |   |   |   |-- UpdateTaskPage.tsx     # Update task form
|   |   |   |   |-- TaskDetailPage.tsx     # Task detail view
|   |   |   |   |-- DeleteTaskPage.tsx     # Delete task confirmation
|   |   |   |-- Admin/
|   |   |       |-- DashboardPage.tsx      # Admin dashboard
|   |   |       |-- AssignTaskPage.tsx     # Assign task to users
|   |   |
|   |   |-- components/                    # Reusable UI components
|   |   |-- services/                      # API integration layer
|   |   |-- context/                       # Auth and Toast state
|   |   |-- App.tsx                        # Main App component
|   |   |-- main.tsx                       # Application entry point
|   |
|   |-- package.json
|   |-- vite.config.ts
|   |-- tailwind.config.ts
|
|-- task_management.sln                     # Solution file
```

---

## Database Schema

The application uses SQL Server with the following core tables:

- **AspNetUsers** — Extended Identity user with Name, IsActive, and CreatedOn fields
- **Tasks** — Title, Description, Priority, CreatedBy, TaskCompletionDate, StatusId, CategoryId, IsActive, CreatedOn
- **TaskStatus** — StatusId, StatusName, IsActive, CreatedOn
- **TaskCategory** — CategoryId, CategoryName, IsActive, CreatedOn

Relationships:

```
ApplicationUser (1) ──→ (Many) Tasks
TaskStatus      (1) ──→ (Many) Tasks
TaskCategory    (1) ──→ (Many) Tasks
```

---

## How to Run

### Prerequisites

- .NET 8.0 SDK
- SQL Server (LocalDB or Express Edition)
- Node.js v18.0.0 or later

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/MuhammadHamzaZeeshan/task-management-app.git 
   cd task-management-app
   ```

2. Configure the database connection in `task_management.Server/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER\\SQLEXPRESS;Database=Task_Management_System;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

3. Restore packages and apply migrations:
   ```
   cd task_management.Server
   dotnet restore
   dotnet ef database update
   ```

4. Install frontend dependencies:
   ```
   cd ../task_management.client
   npm install
   ```

### Running the Application

**Terminal 1 — Start Backend:**
```
cd task_management.Server
dotnet run
```
Backend runs at `https://localhost:5296`. Swagger docs at `https://localhost:5296/swagger`.

**Terminal 2 — Start Frontend:**
```
cd task_management.client
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## Configuration

### JWT Settings (`appsettings.json`)

```json
"ApiSettings": {
  "JwtOptions": {
    "Secret": "YOUR_SECRET_KEY_HERE",
    "Issuer": "taskManagement-auth-api",
    "Audience": "taskManagement-client"
  }
}
```

Replace the `Secret` with a strong, unique key before deploying to production.

### CORS

The backend allows requests from `https://localhost:5173` by default. Update `Program.cs` if your frontend runs on a different port:

```csharp
policy.WithOrigins("https://localhost:YOUR_PORT")
```

---

## API Endpoints

### Authentication (`/api/auth`)

**Register:**
```
POST /api/auth/register
{ "Name": "John Doe", "Email": "john@example.com", "Password": "SecurePassword123!" }
```

**Login:**
```
POST /api/auth/login
{ "Email": "john@example.com", "Password": "SecurePassword123!" }
```
Returns a JWT token and user info including role.

**Create Admin:**
```
POST /api/auth/CreateAdmin
{ "Email": "admin@example.com", "Name": "Admin User", "Password": "AdminPassword123!" }
```

### Tasks (`/api/task`) — Requires Bearer Token

- `POST /api/task/Create` — Create a new task
- `PUT /api/task/Update` — Update an existing task
- `GET /api/task/GetTaskById/{taskId}` — Get task by ID
- `GET /api/task/GetAll` — Get all tasks (Admin only)

### Users (`/api/user`)

- `GET /api/user/GetAllUsers` — List all users

---

## Frontend Pages

- `/auth` — Login and registration with tab-based interface
- `/` — Landing page with role-based navigation
- `/userHome` — Personal task dashboard with filter and sort
- `/createTask` — Task creation form with full field set
- `/taskDetail/:id` — Full task detail view
- `/updateTask/:id` — Pre-populated task update form
- `/deleteTask/:id` — Deletion confirmation page
- `/dashboard` — Admin dashboard with system-wide task stats
- `/assignTask` — Assign tasks to specific users (Admin only)

---

## License

This project was developed as part of the 10Pearls .NET Fullstack Internship program.