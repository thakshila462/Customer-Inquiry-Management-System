# Customer Inquiry Management System

A full-stack web application developed for the Coffee Ninja (Pvt) Ltd Full-Stack Development Technical Assessment.

The system helps staff members record, search, view, and manage customer inquiries through a centralized application.

## Features

- Staff login and authentication.
- Create customer inquiries.
- View existing inquiries.
- Search and filter inquiries.
- View individual inquiry details.
- Update inquiry statuses.
- PostgreSQL database persistence.
- Backend authentication and input validation.
- User-friendly loading, empty, and error states.

## Technology Stack

### Frontend
- React
- JavaScript
-  Tailwind CSS 

### Backend
- Node.js
- Express.js
- JSON Web Token (JWT)
- bcrypt

### Database
- PostgreSQL

## Project Structure

```text
Customer-Inquiry-Management-System/
├── frontend/
├── backend/
├── README.md
├── DECISIONS.md
└── .gitignore
```
## used MVC architecture

The directory structure may vary depending on the final implementation.

## Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- PostgreSQL
- Git

Check the installed versions:

```bash
node --version
npm --version
psql --version
```

## Database Setup

### 1. Create the Database

Open PostgreSQL and execute:

```sql
CREATE DATABASE customer_inquiry_db;
```

### 2. Create the Tables

Execute the SQL statements in:

`database/schema.sql`

The database contains the following main tables:

**Users**
- `id`
- `full_name`
- `email`
- `password_hash`
- `created_at`

**Inquiries**
- `id`
- `customer_name`
- `contact_info`
- `subject`
- `description`
- `status`
- `created_by`
- `created_at`
- `updated_at`

The `created_by` field associates each inquiry with the staff member who created it.

## Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install
```
```

Start the backend:

```bash
npm run dev
```

The API will run at the configured local address, for example:

`http://localhost:5000`

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Configure the backend API URL using the environment variable expected by the frontend.

For a Vite application, an example is:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

For a typical Vite application, the URL is:

`http://localhost:5173`

## Authentication

The application provides staff authentication.

Protected API endpoints require valid authentication credentials. Authentication and access rules are enforced by the backend rather than relying only on frontend restrictions.

### Test Account

Use the seeded staff account configured for the application.

- **Email:** `anjana@gmail.com`
- **Password:** Anjana@123.(this convert to hashing using with-> (node -e "require('bcrypt').hash('YourPassword123', 12).then(console.log)")

Make sure the test account exists in the database and the documented credentials are correct.

## Inquiry Lifecycle

The system supports three inquiry statuses:

- **NEW:** The inquiry has been recorded and is awaiting action.
- **IN_PROGRESS:** The inquiry is being handled.
- **RESOLVED:** The inquiry has been addressed.

The intended workflow is:

`NEW → IN_PROGRESS → RESOLVED`

A resolved inquiry may be reopened as `IN_PROGRESS`, according to the implemented business rules.

Invalid status transitions should be rejected by the backend.

## Validation and Error Handling

The application validates inquiry information before saving it.

The backend is responsible for independently validating incoming data and enforcing authentication and access restrictions.

The application should provide appropriate feedback for:

- Missing or invalid input.
- Authentication failures.
- Unauthorized access.
- Nonexistent inquiries.
- Invalid status transitions.
- Loading and empty states.
- Failed API requests.

## Testing

The project includes backend and frontend tests.

The backend test should verify a business, security, or validation rule.

The frontend test should verify a user interaction or UI state.

Run tests using the scripts configured in the respective `package.json` files.

For example, if an `npm test` script is configured:

```bash
npm test
```

Run the command separately in the backend and frontend directories.



