# Task Management Application

A comprehensive web-based task management system built with **ASP.NET Core** and **React.js** that enables users to organize, track, and manage their tasks efficiently. The application supports user authentication, role-based authorization, and full CRUD operations for tasks with categorization and priority management.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Authentication and Authorization](#authentication-and-authorization)
- [Database Migrations](#database-migrations)
- [Contributing](#contributing)

---

## 📖 Project Overview

The Task Management Application is a full-stack web solution designed to help users create, manage, and track tasks effectively. The application provides role-based access control with two primary user roles: **Admin** and **User**. Admins can view all system tasks and manage users, while regular users can create and manage their own tasks.

The backend is built using **ASP.NET Core 8.0** with **Entity Framework Core** for data persistence, while the frontend is developed using **React.js** with **TypeScript** and **Tailwind CSS** for a modern, responsive user interface.

---

## 🛠️ Technology Stack

### Backend
- **Framework:** ASP.NET Core 8.0
- **Database:** SQL Server
- **ORM:** Entity Framework Core 8.0.14
- **Authentication:** JWT (JSON Web Tokens) with Bearer scheme
- **Identity Management:** ASP.NET Core Identity
- **Object Mapping:** AutoMapper 12.0.0
- **API Documentation:** Swagger/OpenAPI 8.0.0
- **Architecture:** Repository Pattern

### Frontend
- **Library:** React.js 19.0.0
- **Language:** TypeScript 5.7.2
- **Build Tool:** Vite 6.2.0
- **Routing:** React Router 7.4.0
- **UI Framework:** Tailwind CSS 4.0.15
- **Component Library:** Radix UI
- **Form Handling:** React Hook Form 7.54.2
- **Data Validation:** Zod 3.24.2
- **HTTP Client:** Fetch API
- **Styling:** PostCSS, Tailwind Merge

### Development Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Linting:** ESLint 9.21.0
- **Runtime:** Node.js

---

## ✨ Key Features

### User Authentication & Authorization
- **User Registration:** New users can create accounts with email and password
- **User Login:** Secure login with JWT token-based authentication
- **Role-Based Access Control:** Two primary roles implemented
  - **ADMIN:** Full system access, view all tasks, manage users
  - **USER:** Limited access, manage personal tasks
- **JWT Token Management:** Secure token generation and validation with configurable expiration

### Task Management
- **Create Tasks:** Users can create new tasks with detailed information
- **Read Tasks:** View task details with complete information
- **Update Tasks:** Modify task properties including status, priority, and due dates
- **Delete Tasks:** Remove tasks from the system (soft delete via IsActive flag)
- **Task Categorization:** Organize tasks by predefined categories
- **Task Priority:** Assign priority levels to tasks
- **Task Status:** Track task progress with different status values (Pending, In Progress, Completed)
- **Task Completion Dates:** Set and track task deadlines

### Role-Based Task Views
- **Admin Dashboard:** View all system tasks with detailed statistics
- **User Dashboard:** Access personal tasks and create new ones

### Task Properties
- Task ID (unique identifier)
- Title (up to 200 characters)
- Description (up to 1000 characters)
- Priority (numeric value for sorting)
- Creator Information (CreatedBy field)
- Task Completion Date (deadline)
- Status (references TaskStatus)
- Category (references TaskCategory)
- Active Status (soft delete capability)
- Creation Timestamp

---

## 🏗️ System Architecture

The application follows a **layered architecture** pattern with clear separation of concerns:

### Backend Architecture

```
Controllers Layer
      ↓
Repository Pattern (Data Access)
      ↓
Entity Framework Core
      ↓
SQL Server Database
```

### Key Architectural Components

1. **Controllers:** Handle HTTP requests and responses
   - `AuthController`: User registration, login, and role assignment
   - `TaskController`: Task CRUD operations
   - `UserController`: User information retrieval

2. **Repository Layer:** Implements data access abstraction
   - `AuthRepository`: Authentication and user operations
   - `TaskRepository`: Task database operations
   - `UserRepository`: User data access
   - Interface-based design for testability

3. **Models:** Domain entities
   - `ApplicationUser`: Extended Identity user with custom fields
   - `Task`: Task entity with relationships
   - `TaskStatus`: Task status reference
   - `TaskCategory`: Task category reference

4. **Data Context:** Entity Framework DbContext
   - `AppDbContext`: Centralized database context

5. **DTOs (Data Transfer Objects):** API contract objects
   - `TaskDto`: Task data transfer
   - `RegistrationRequestDto`: Registration data
   - `LoginRequestDto`: Login credentials
   - `ResponseDto`: Standardized API response

### Frontend Architecture

```
Pages (Route Components)
      ↓
Components (Reusable UI Elements)
      ↓
Services (API Integration)
      ↓
Context (State Management)
      ↓
HTTP Fetch (Backend Communication)
```

---

## 💾 Database Schema

### Tables

#### AspNetUsers (Extended Identity Table)
- `Id` (Primary Key, string)
- `UserName` (string)
- `Email` (string, unique)
- `PasswordHash` (string)
- `Name` (custom field, string)
- `IsActive` (boolean, default: true)
- `CreatedOn` (datetime, default: Now)
- *Additional Identity fields*

#### Tasks
- `TaskId` (Primary Key, int)
- `Title` (string, max 200 chars, required)
- `Description` (string, max 1000 chars, required)
- `Priority` (int, required)
- `CreatedBy` (string, required)
- `TaskCompletionDate` (datetime, required)
- `StatusId` (Foreign Key → TaskStatus)
- `CategoryId` (Foreign Key → TaskCategory)
- `IsActive` (boolean, default: true)
- `CreatedOn` (datetime, default: Now)

#### TaskStatus
- `StatusId` (Primary Key, int)
- `StatusName` (string, required)
- `IsActive` (boolean, default: true)
- `CreatedOn` (datetime, default: Now)

#### TaskCategory
- `CategoryId` (Primary Key, int)
- `CategoryName` (string, required)
- `IsActive` (boolean, default: true)
- `CreatedOn` (datetime, default: Now)

#### AspNetRoles (Identity Role Table)
- `Id` (Primary Key, string)
- `Name` (string)
- `NormalizedName` (string)

### Relationships

```
ApplicationUser (1) ──→ (Many) Tasks
TaskStatus (1) ──→ (Many) Tasks
TaskCategory (1) ──→ (Many) Tasks
```

---

## 📁 Project Structure

```
task-management-app/
├── task_management.Server/                 # Backend (ASP.NET Core)
│   ├── Controllers/
│   │   ├── AuthController.cs              # Authentication endpoints
│   │   ├── TaskController.cs              # Task management endpoints
│   │   └── UserController.cs              # User management endpoints
│   │
│   ├── Models/
│   │   ├── ApplicationUser.cs             # Extended Identity user
│   │   ├── Task.cs                        # Task entity
│   │   ├── TaskStatus.cs                  # Task status reference
│   │   └── TaskCategory.cs                # Task category reference
│   │
│   ├── Repository/
│   │   ├── AuthRepository.cs              # Auth data operations
│   │   ├── TaskRepository.cs              # Task data operations
│   │   ├── UserRepository.cs              # User data operations
│   │   └── JwtTokenGenerator.cs           # JWT token generation
│   │
│   ├── Contracts/
│   │   ├── IAuthRepository.cs             # Auth interface
│   │   ├── ITaskRepository.cs             # Task interface
│   │   ├── IUserRepository.cs             # User interface
│   │   └── IJwtTokenGenenrator.cs         # JWT interface
│   │
│   ├── Dto/
│   │   ├── ResponseDto.cs                 # API response wrapper
│   │   ├── AuthDto/
│   │   │   ├── RegistrationRequestDto.cs
│   │   │   ├── LoginRequestDto.cs
│   │   │   └── LoginResponseDto.cs
│   │   └── Tasks/
│   │       └── TaskDto.cs                 # Task data transfer
│   │
│   ├── Data/
│   │   └── AppDbContext.cs                # Entity Framework DbContext
│   │
│   ├── Migrations/                        # EF Core migrations
│   │
│   ├── Properties/
│   │   └── launchSettings.json            # Launch configuration
│   │
│   ├── appsettings.json                   # Configuration file
│   ├── appsettings.Development.json       # Development configuration
│   ├── MapperConfig.cs                    # AutoMapper configuration
│   ├── Program.cs                         # Application startup
│   └── task_management.Server.csproj      # Project file
│
└── task_management.client/                 # Frontend (React + TypeScript)
    ├── src/
    │   ├── pages/
    │   │   ├── AuthPage.tsx               # Authentication page
    │   │   ├── Home.tsx                   # Landing/home page
    │   │   ├── User/
    │   │   │   ├── UserHome.tsx           # User task dashboard
    │   │   │   ├── CreateTaskPage.tsx     # Create task form
    │   │   │   ├── UpdateTaskPage.tsx     # Update task form
    │   │   │   ├── TaskDetailPage.tsx     # Task detail view
    │   │   │   └── DeleteTaskPage.tsx     # Delete task confirmation
    │   │   └── Admin/
    │   │       ├── DashboardPage.tsx      # Admin dashboard
    │   │       └── AssignTaskPage.tsx     # Assign task to users
    │   │
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── SignInForm.tsx         # Login form
    │   │   │   └── SignUpForm.tsx         # Registration form
    │   │   ├── sidebar.tsx                # Navigation sidebar
    │   │   ├── Toast.tsx                  # Toast notification
    │   │   └── ui/                        # Reusable UI components
    │   │
    │   ├── services/
    │   │   ├── AuthService.ts             # Auth API integration
    │   │   ├── TaskService.ts             # Task API integration
    │   │   └── UserService.ts             # User API integration
    │   │
    │   ├── context/
    │   │   ├── AuthContext.tsx            # Authentication state
    │   │   └── ToastContext.tsx           # Toast notification state
    │   │
    │   ├── lib/
    │   │   └── utils.ts                   # Utility functions
    │   │
    │   ├── App.tsx                        # Main App component
    │   ├── main.tsx                       # Application entry point
    │   ├── index.css                      # Global styles
    │   └── vite-env.d.ts                  # Vite environment types
    │
    ├── public/                             # Static assets
    ├── index.html                          # HTML template
    ├── package.json                        # Dependencies
    ├── tsconfig.json                       # TypeScript configuration
    ├── vite.config.ts                      # Vite build configuration
    ├── tailwind.config.ts                  # Tailwind CSS configuration
    ├── postcss.config.cjs                  # PostCSS configuration
    └── eslint.config.js                    # ESLint rules

└── task_management.sln                     # Solution file
```

---

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

### Backend Requirements
- **.NET 8.0 SDK** or later ([Download](https://dotnet.microsoft.com/download/dotnet/8.0))
- **SQL Server** (LocalDB or Express Edition)
- **Visual Studio 2022** or **Visual Studio Code** with C# extension

### Frontend Requirements
- **Node.js** (v18.0.0 or later) ([Download](https://nodejs.org/))
- **npm** (typically comes with Node.js)
- **Git** for version control

### Environment Setup
- Git installed and configured
- Adequate storage space for dependencies
- Administrator access for SQL Server setup (if needed)

---

## 🚀 Setup and Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/task-management-app.git
cd task-management-app
```

### Step 2: Backend Setup

#### 2.1 Configure SQL Server Connection

Open `task_management.Server/appsettings.json` and update the connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER\\SQLEXPRESS;Database=Task_Management_System;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

Replace `YOUR_SERVER` with your SQL Server instance name.

#### 2.2 Restore NuGet Packages

```bash
cd task_management.Server
dotnet restore
```

#### 2.3 Apply Database Migrations

```bash
dotnet ef database update
```

This will create the database and apply all migrations automatically.

### Step 3: Frontend Setup

#### 3.1 Install Node Dependencies

```bash
cd ../task_management.client
npm install
```

#### 3.2 Verify Frontend Configuration

Ensure the API base URL in services matches your backend URL. Check `AuthService.ts`, `TaskService.ts`, and `UserService.ts`:

```typescript
const api_url = "http://localhost:5296/api/...";
```

The default backend port is `5296`. Adjust if your backend runs on a different port.

---

## ⚙️ Configuration

### Backend Configuration

#### JWT Settings (`appsettings.json`)

```json
"ApiSettings": {
  "JwtOptions": {
    "Secret": "YOUR_SECRET_KEY_HERE",
    "Issuer": "taskManagement-auth-api",
    "Audience": "taskManagement-client"
  }
}
```

**Important:** Replace the `Secret` with a strong, unique secret key for production environments.

#### Database Connection

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER\\SQLEXPRESS;Database=Task_Management_System;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

#### CORS Configuration

The backend allows requests from the frontend running on `https://localhost:5173`. Update `Program.cs` if your frontend runs on a different URL:

```csharp
options.AddPolicy("AllowFrontend",
    policy => policy.WithOrigins("https://localhost:YOUR_PORT")
                    .AllowAnyMethod()
                    .AllowAnyHeader());
```

### Frontend Configuration

#### API Base URL

Update the API URLs in the service files to match your backend URL:

- [AuthService.ts](task_management.client/src/services/AuthService.ts)
- [TaskService.ts](task_management.client/src/services/TaskService.ts)
- [UserService.ts](task_management.client/src/services/UserService.ts)

Default backend URL: `http://localhost:5296`

---

## ▶️ Running the Application

### Option 1: Run Both Frontend and Backend Separately

#### Terminal 1: Start Backend

```bash
cd task_management.Server
dotnet run
```

Backend will be available at: `https://localhost:5296`
Swagger API documentation: `https://localhost:5296/swagger`

#### Terminal 2: Start Frontend

```bash
cd task_management.client
npm run dev
```

Frontend will be available at: `http://localhost:5173` (default Vite port)

### Option 2: Run from Visual Studio (Recommended for Development)

1. Open `task_management.sln` in Visual Studio 2022
2. Set `task_management.Server` as the startup project
3. Press `F5` or click "Start Debugging"
4. The SPA proxy will automatically start the React frontend

### Option 3: Build and Run Production

#### Build Frontend

```bash
cd task_management.client
npm run build
```

#### Build and Run Backend

```bash
cd task_management.Server
dotnet publish -c Release
dotnet task_management.Server.dll
```

---

## 🔌 API Endpoints

### Authentication Endpoints

All authentication endpoints are available at `/api/auth`

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "Name": "John Doe",
  "Email": "john@example.com",
  "Password": "SecurePassword123!"
}

Response: 200 OK
{
  "IsSuccess": true,
  "Message": "Registration successful",
  "Result": null
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "Email": "john@example.com",
  "Password": "SecurePassword123!"
}

Response: 200 OK
{
  "IsSuccess": true,
  "Message": "Login successful",
  "Result": {
    "User": {
      "Id": "user-id",
      "Email": "john@example.com",
      "Name": "John Doe",
      "Role": "USER"
    },
    "Token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Create Admin User
```
POST /api/auth/CreateAdmin
Content-Type: application/json

{
  "Email": "admin@example.com",
  "Name": "Admin User",
  "Password": "AdminPassword123!"
}

Response: 200 OK
{
  "IsSuccess": true,
  "Message": "Admin role assigned",
  "Result": true
}
```

### Task Endpoints

All task endpoints require JWT authorization header: `Authorization: Bearer {token}`

#### Create Task
```
POST /api/task/Create
Authorization: Bearer {token}
Content-Type: application/json

{
  "Title": "Complete Project",
  "Description": "Finish the task management app",
  "Priority": 1,
  "CreatedBy": "user-email@example.com",
  "TaskCompletionDate": "2024-06-30T00:00:00",
  "StatusId": 1,
  "CategoryId": 1,
  "IsActive": true
}

Response: 200 OK
```

#### Update Task
```
PUT /api/task/Update
Authorization: Bearer {token}
Content-Type: application/json

{
  "TaskId": 1,
  "Title": "Updated Title",
  "Description": "Updated description",
  "Priority": 2,
  "CreatedBy": "user-email@example.com",
  "TaskCompletionDate": "2024-07-15T00:00:00",
  "StatusId": 2,
  "CategoryId": 1,
  "IsActive": true
}

Response: 200 OK
```

#### Get Task by ID
```
GET /api/task/GetTaskById/{taskId}
Authorization: Bearer {token}

Response: 200 OK
{
  "IsSuccess": true,
  "Result": {
    "TaskId": 1,
    "Title": "Complete Project",
    "Description": "Finish the task management app",
    "Priority": 1,
    "CreatedBy": "user-email@example.com",
    "TaskCompletionDate": "2024-06-30T00:00:00",
    "StatusId": 1,
    "CategoryId": 1,
    "IsActive": true,
    "CreatedOn": "2024-05-17T10:30:00"
  }
}
```

#### Get All Tasks (Admin Only)
```
GET /api/task/GetAll
Authorization: Bearer {token}
Role: ADMIN

Response: 200 OK
{
  "IsSuccess": true,
  "Result": [
    { /* task object */ },
    { /* task object */ }
  ]
}
```

### User Endpoints

#### Get All Users
```
GET /api/user/GetAllUsers

Response: 200 OK
{
  "IsSuccess": true,
  "Message": "User Found Successfully",
  "Result": [
    {
      "Id": "user-id",
      "Email": "john@example.com",
      "Name": "John Doe"
    }
  ]
}
```

---

## 🎨 Frontend Pages

### 1. Authentication Page (`/auth`)
- **Components:** Sign In Form, Sign Up Form
- **Functionality:**
  - User registration with email, name, and password
  - User login with email and password
  - Tab-based interface for switching between login and signup
  - Form validation
  - Error handling with toast notifications
- **Redirect:** Upon successful login, users are redirected based on role (Admin → Dashboard, User → User Home)

### 2. Home Page (`/`)
- **Components:** Welcome section, navigation buttons
- **Functionality:**
  - Landing page for unauthenticated users
  - Role-based button display (My Tasks for USER, Dashboard for ADMIN)
  - Quick access to create task feature

### 3. User Task Dashboard (`/userHome`)
- **Components:** Task list, task filters
- **Functionality:**
  - Display all user's tasks
  - View task summary with status indicators
  - Navigate to task detail page
  - Access create task, update task, and delete task pages
  - Filter and sort tasks

### 4. Create Task Page (`/createTask`)
- **Components:** Task form with title, description, priority, category, status, due date
- **Functionality:**
  - Create new tasks with comprehensive details
  - Form validation
  - Submit task to backend
  - Success/error notifications
  - Redirect to task list after creation

### 5. Task Detail Page (`/taskDetail/:id`)
- **Components:** Full task information display
- **Functionality:**
  - Display complete task information
  - Show task metadata (creation date, creator, status, priority)
  - Navigation to update or delete task

### 6. Update Task Page (`/updateTask/:id`)
- **Components:** Pre-populated task form
- **Functionality:**
  - Fetch existing task data
  - Pre-populate form fields
  - Modify task details
  - Submit updates to backend
  - Confirmation feedback

### 7. Delete Task Page (`/deleteTask/:id`)
- **Components:** Confirmation dialog, task preview
- **Functionality:**
  - Confirm task deletion
  - Display task to be deleted
  - Send delete request to backend
  - Redirect to task list after deletion

### 8. Admin Dashboard (`/dashboard`)
- **Components:** Task statistics cards, all tasks overview
- **Functionality:**
  - Display summary statistics
  - View all system tasks
  - Navigate to assign task page
  - Task management controls

### 9. Assign Task Page (`/assignTask`)
- **Components:** Task assignment form, user selection
- **Functionality:**
  - Assign tasks to specific users
  - Select task and assignee
  - Update task assignment
  - Success/error feedback

---

## 🔐 Authentication and Authorization

### Authentication Flow

1. **Registration:**
   - User submits email, name, and password
   - Backend creates new ApplicationUser account
   - Password hashed using ASP.NET Core Identity
   - User assigned "USER" role by default

2. **Login:**
   - User submits email and password
   - Backend validates credentials
   - JWT token generated on success
   - Token includes user claims (Id, Email, Name, Role)
   - Token stored in browser localStorage

3. **Token Usage:**
   - Frontend includes JWT in Authorization header: `Bearer {token}`
   - Backend validates token signature and expiration
   - Claims extracted from token for authorization

### Authorization Flow

1. **Role-Based Access Control:**
   - **ADMIN Role:**
     - Access to admin dashboard
     - View all system tasks
     - Manage user assignments
     - Full task visibility
   
   - **USER Role:**
     - Access to personal task management
     - Create/update/delete own tasks
     - Limited to personal task data
     - Cannot access admin features

2. **Route Protection:**
   - Protected routes check for valid JWT token
   - Invalid/missing token redirects to auth page
   - Role-based route restrictions enforce access control

3. **API Authorization:**
   - `[Authorize]` attribute on controllers restricts access
   - `[Authorize(Roles = "ADMIN")]` restricts to admin endpoints
   - `[Authorize(Roles = "USER")]` restricts to user endpoints

### JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "USER",
  "iss": "taskManagement-auth-api",
  "aud": "taskManagement-client",
  "exp": 1718...
}
```

---

## 📊 Database Migrations

### Applied Migrations

1. **20250326073631_addIdentityTables**
   - Creates Identity tables (AspNetUsers, AspNetRoles, etc.)

2. **20250326075654_addCustomColumnsToAspNetUsers**
   - Adds custom columns to AspNetUsers (Name, IsActive, CreatedOn)

3. **20250405071534_AddedTaskStatusAndCategoryTables**
   - Creates TaskStatus and TaskCategory tables

4. **20250405073042_AddedTaskTable**
   - Creates Task table with relationships

### Adding New Migrations

When modifying models, create and apply new migrations:

```bash
# Create new migration
dotnet ef migrations add {MigrationName}

# Apply migrations to database
dotnet ef database update
```

---

## 🤝 Contributing

To contribute to this project:

1. Create a new feature branch
   ```bash
   git checkout -b feature/feature-name
   ```

2. Make your changes and commit
   ```bash
   git commit -m "Add feature description"
   ```

3. Push to the repository
   ```bash
   git push origin feature/feature-name
   ```

4. Create a Pull Request with a clear description of changes

### Branch Naming Convention
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `docs/` - Documentation updates

### Commit Message Guidelines
- Use clear, descriptive messages
- Start with action verb (Add, Fix, Update, etc.)
- Keep messages concise but informative

---

## 📝 License

This project is provided as-is for educational and commercial purposes.

---

## 📧 Support

For issues, questions, or suggestions, please create an issue in the repository or contact the development team.

---

## 🎯 Future Enhancements

While not currently implemented, the following features are potential enhancements:

- **Real-time Updates:** SignalR integration for live task updates
- **Advanced Logging:** Comprehensive Serilog integration for audit trails
- **Unit Testing:** xUnit test suite for controllers, services, and repositories
- **Code Quality Analysis:** SonarQube integration for code metrics
- **Import/Export:** Bulk task import/export functionality
- **Advanced Search:** Full-text search and filtering across tasks
- **Notifications:** Email and in-app task notifications

---

**Last Updated:** May 17, 2026
