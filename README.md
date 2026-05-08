# Alumni Influencers Platform — Part 2

A university analytics dashboard built for the Alumni Influencers platform. 

---

## Architecture Overview

The system uses a three-layer architecture:

- **React frontend (port 5173)** — university staff interface for viewing analytics charts, browsing alumni profiles, managing API keys, and placing bids
- **Express backend / Part 2 server (port 5000)** — handles JWT authentication, API key management, bidding logic, usage logging, and proxies all data requests to Part 1
- **MySQL database** — stores users, API keys, usage logs, bids, and bid winners
- **Part 1 API (external)** — the source of all alumni profile and analytics data, called by the Part 2 server using a scoped API key

### Database Schema

![Database Schema](server/docs/schema.png)


## Prerequisites

- Node.js v18 or v20
- MySQL 8.0
- Git
- A [Mailtrap](https://mailtrap.io) account (free) for email testing
- Part 1 server running on port 3001

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/alumni-influencers-part2.git
cd alumni-influencers-part2
```

### 2. Set up the database
Open MySQL Workbench or the MySQL CLI and run:
```sql
CREATE DATABASE alumni_platform;
```
Then create the tables by running the schema file:

mysql -u root -p alumni_platform < server\docs\schema.sql

### 3. Configure the server
cd server
copy .env.example .env

Fill in your values — see the **Environment Variables** section below.

### 4. Install server dependencies
npm install

### 5. Seed the initial API keys
npm run seed:keys

Copy the printed plaintext keys — you will need the `analytics_dashboard` key. These are shown only once.

### 6. Install client dependencies
cd ..\client
npm install

### 7. Run the application
Open two terminals:

# Terminal 1 — server
# Terminal 1 — server
cd server
npm run dev

# Terminal 2 — client
cd client
npm run dev

### 8. Open the app
Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

### 9. Register an account
Register using a university email address ending in `@iit.ac.lk`. Check Mailtrap for the verification email and click the link before logging in.

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in each value:

```env
# Server port — default 5000, change if already in use
PORT=5000
```

# MySQL connection details
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_root_password
DB_NAME=alumni_platform

# JWT signing secret — generate a strong random value with:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=

# JWT token expiry — 1h means tokens expire after one hour
JWT_EXPIRES_IN=1h

# Email config — sign up free at https://mailtrap.io
# Go to: Email Testing → Inboxes → My Inbox → SMTP Settings
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=noreply@alumni-platform.com

# Part 1 API connection
# URL of the Part 1 alumni API server
PART1_API_BASE_URL=http://localhost:3001/api

# API key for Part 2 server to authenticate with Part 1
# Get this from your Part 1 API key management


## API Endpoints

### Auth (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with university email |
| GET | `/api/auth/verify-email/:token` | Verify email address |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/me` | Get current user (JWT required) |

### Alumni & Analytics (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alumni` | List alumni with filters and pagination |
| GET | `/api/alumni/:id` | Single alumni profile |
| GET | `/api/analytics/summary` | Dashboard summary stats |
| GET | `/api/analytics/alumni-by-field` | Alumni by field of study |
| GET | `/api/analytics/alumni-by-year` | Alumni by graduation year |
| GET | `/api/analytics/top-employers` | Top employers |
| GET | `/api/analytics/top-job-titles` | Most common job titles |
| GET | `/api/analytics/certifications-by-type` | Certifications breakdown |
| GET | `/api/analytics/bid-history` | Bid activity over time |
| GET | `/api/analytics/geographic-distribution` | Alumni by company |

### Admin — API Key Management (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/api-keys` | Create new API key |
| GET | `/api/admin/api-keys` | List all keys |
| DELETE | `/api/admin/api-keys/:id` | Deactivate a key |
| GET | `/api/admin/api-keys/:id/usage` | Usage logs for a key |
| GET | `/api/admin/api-keys/stats` | Aggregate usage stats |

### External (API key required)
| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/api/external/alumni` | `read:alumni` |
| GET | `/api/external/alumni/:id` | `read:alumni` |
| GET | `/api/external/analytics` | `read:analytics` |
| GET | `/api/external/alumni-of-day` | `read:alumni_of_day` |


## Postman Collection
server/docs/Alumni API Key Management Tests.postman_collection.json
