# Design Decisions – Customer Inquiry Management System

## 1. Assumptions

- The system is designed for staff members who manage customer inquiries.
- Staff members must log in before accessing inquiry management features.
- Each inquiry contains a customer name, contact information, subject, description, status, and creation details.
- PostgreSQL is used to store user and inquiry data.
- Inquiry statuses are New, In Progress, and Resolved.

## 2. Key Design Decisions

### 2.1 Authentication and Authorization

JWT authentication is used to protect the backend API. Protected endpoints require a valid access token.

**Reason:** Authentication must be enforced on the backend because frontend-only protection can be bypassed.

### 2.2 Inquiry Status Management

The system supports the following status transitions:

- New → In Progress
- In Progress → Resolved
- Resolved → In Progress

Invalid status values and unsupported transitions should be rejected by the backend.

**Reason:** This keeps the inquiry lifecycle predictable and prevents invalid status updates.

### 2.3 Input Validation and Error Handling

Inquiry data should be validated before it is saved. Required fields must not be empty, and invalid requests should return appropriate error responses.

The frontend should provide clear loading, empty, and error states.

**Reason:** Validation improves data quality, while clear feedback helps staff understand the result of each action.

## 3. Trade-off

JWT authentication provides a straightforward way to protect API endpoints without maintaining a traditional server-side session for every request. However, token expiration and storage require careful handling.

The current implementation prioritizes a simple authentication flow. A production version could introduce stronger token lifecycle management and additional security controls.

## 4. Future Improvements

- Add pagination for large inquiry lists.
- Improve search and filtering options.
- Add an audit log to track inquiry status changes.
- Expand automated tests for authentication, validation, and status transitions.
- Improve accessibility and responsive design.

git add DECISIONS.md
git commit -m "Update design decisions documentation"
git push origin main

