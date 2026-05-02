# SCIARS – Smart Campus Issue & Response System

## Overview

SCIARS is a web-based platform designed to streamline reporting, tracking, and resolution of campus issues. It enables students and staff to report problems, while administrators and supervisors manage and resolve them efficiently.

---

## Features

* User authentication using Firebase
* Role-based access (User, Supervisor, Admin)
* Issue reporting with categorization
* Real-time notifications system
* Dashboard for monitoring and management
* Secure backend with role validation
* Scalable API architecture

---

## Tech Stack

### Frontend

* React (Vite)
* JavaScript (ES6+)
* Firebase Authentication

### Backend

* FastAPI (Python)
* Firebase Admin SDK
* REST API architecture

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```
sciars-core/
│
├── frontend/              # React (Vite) app
│   ├── src/
│   └── public/
│
├── backend/
│   ├── routers/           # API routes (users, issues, notifications)
│   ├── middleware/        # Auth middleware
│   ├── services/          # Firebase integration
│   └── main.py            # FastAPI entry point
```

---

## Environment Variables

### Frontend (.env)

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=https://your-backend-url
```

### Backend (Render Environment)

```
FIREBASE_KEY=<your_firebase_service_account_json>
CORS_ORIGINS=https://your-frontend-url
```

---

## Installation & Setup

### Clone the repository

```
git clone https://github.com/your-username/sciars.git
cd sciars
```

---

### Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

### Backend Setup

```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## API Base URL

```
https://your-backend-url/api
```

---

## Key Endpoints

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/users/sync    | Sync user role      |
| GET    | /api/issues        | Get all issues      |
| POST   | /api/issues        | Create issue        |
| GET    | /api/notifications | Fetch notifications |

---

## Authentication

* Uses Firebase Authentication
* Requires Bearer token in headers:

```
Authorization: Bearer <firebase_id_token>
```

---

## Deployment

### Frontend (Vercel)

* Add environment variables in Vercel dashboard
* Deploy via Git integration

### Backend (Render)

* Set environment variables
* Use:

```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## Common Issues & Fixes

### CORS Errors

* Ensure correct frontend URL in backend `CORS_ORIGINS`
* Avoid using preview URLs in production

### API not working

* Check `VITE_API_URL`
* Redeploy after env changes

### Firebase errors

* Verify service account JSON formatting
* Ensure correct project configuration

---

## Future Improvements

* Real-time updates using WebSockets
* Advanced analytics dashboard
* Mobile app integration
* Issue prioritization using AI

---
## Simple testing if it is Live or Not
* Login on Student 
* UserID:  estudent1@gmail.com
* Pass: 123123123
* If it logs in and shows issues it is working


## License and Usage

This project is proprietary.

All rights are reserved by the authors. No part of this codebase may be copied, modified, distributed, or used in any form without explicit permission.

Forking this repository does not grant any rights to use or reuse the code for personal, academic, or commercial purposes.

© 2026 P.R Rhishabh . All rights reserved.
