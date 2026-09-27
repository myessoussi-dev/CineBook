# CineBook

A full-stack cinema seat booking platform, deployed in production on a DigitalOcean VPS.

Users can browse currently playing and upcoming movies, select a screening session, choose their seats on an interactive seat map, and receive a booking confirmation by email. Authentication is handled through OTP email verification and JWT tokens.

**Live:** https://cinebook.youssefess.dev

---

## Architecture

The application runs on a DigitalOcean VPS using Docker Compose. All traffic passes through Cloudflare (DNS proxy, DDoS protection, SSL Full Strict with a 15-year Origin Certificate) before reaching the server.

Two Docker networks isolate the services:

- `gateway` — shared network connecting all Nginx instances to the central gateway
- `cinebook` — private network for the CineBook application stack only

### Request flow

```
User Browser
    |  HTTPS
Cloudflare  (DNS Proxy, DDoS, TLS termination)
    |
Nginx Gateway  (virtual host router — cinebook.youssefess.dev → cinebook_nginx)
    |
Nginx Frontend  (path-based router)
    |-- /              → React static files (Vite build)
    |-- /auth          → Spring Boot :8080
    └-- /api           → Spring Boot :8080
```

### Spring Boot — route groups

**`/auth` — Authentication**

| Endpoint | Description |
|---|---|
| `POST /auth/register` | Stores registration data in Redis, generates OTP, sends verification email via Brevo |
| `POST /auth/verify-otp` | Validates OTP from Redis, persists user to PostgreSQL, returns JWT |
| `POST /auth/login` | Authenticates against PostgreSQL, returns JWT |

**`/api` — REST API** (JWT-secured)

| Endpoint | Description |
|---|---|
| `GET /api/sessions/movies` | Returns available sessions — served from Redis cache, falls back to PostgreSQL |
| `GET /api/sessions/{id}` | Session details from PostgreSQL |
| `GET /api/sessions/{id}/seats` | Full seat map for the room |
| `GET /api/sessions/{id}/reserved-seats` | Already reserved seats for the session |
| `POST /api/reservations` | Persists reservation and reserved seats to PostgreSQL, sends confirmation email |

### Internal services

**Redis** — in-memory store for:
- `otp:{email}` — one-time password, TTL 5 minutes
- `reg:{email}` — registration payload, pending OTP verification
- `cooldown:{email}` — resend cooldown, TTL 30 seconds
- `home:movies` — homepage session cache, invalidated after each ETL run

**PostgreSQL 17** — persistent storage, 9 tables:
`users`, `movies`, `categories`, `movie_categorie`, `sessions`, `room`, `seats`, `reservations`, `reservation_seat`

Connection pooling via HikariCP. Data persisted through a named Docker volume.

### External services

**Brevo SMTP** (`smtp-relay.brevo.com:587`)
Handles two transactional email types: OTP verification (triggered by `/auth/register`) and booking confirmation (triggered by `POST /api/reservations`). Sent via Spring's `JavaMailSender` over STARTTLS.

**TMDB API** (`api.themoviedb.org/3`)
A scheduled ETL job (`@PostConstruct` on startup + `@Scheduled` cron) fetches Now Playing and Upcoming movies, upserts them into PostgreSQL by TMDB ID as primary key, marks missing films as `ARCHIVED`, and invalidates the Redis homepage cache.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Spring Boot 3, Spring Security, JWT |
| Database | PostgreSQL 17 |
| Cache | Redis |
| Reverse proxy | Nginx (x2 — gateway + frontend) |
| Email | Brevo SMTP |
| Movie data | TMDB API |
| Infrastructure | DigitalOcean VPS, Docker Compose |
| Edge | Cloudflare (DNS, DDoS, SSL Full Strict) |

---

## Local setup

### Prerequisites

- Docker and Docker Compose
- A Brevo account (SMTP credentials)
- A TMDB API key

### Environment variables

Copy `.env.example` to `.env` and fill in your own values. These are **local development credentials only** — production secrets are configured directly on the VPS and never committed to the repository.

```env
# TMDB
API_KEY=your_tmdb_api_key

# Database
SPRING_DATASOURCE_USERNAME=your_db_username
SPRING_DATASOURCE_PASSWORD=your_db_password

# Mail (Brevo SMTP)
SPRING_MAIL_USERNAME=your_brevo_login_email
SPRING_MAIL_PASSWORD=your_brevo_smtp_key
MAIL=your_sender_email

# JWT
SECRET_KEY=your_jwt_secret_min_32_chars

# Timezone
TZ=Africa/Tunis
```

### Run

```bash
docker compose up --build -d
```

The application will be available at `http://localhost`.


## Author

Youssef Essoussi — Software Engineering student, INSAT Tunis  
[LinkedIn](https://www.linkedin.com/in/mohamed-youssef-essoussi/) · [cinebook.youssefess.dev](https://cinebook.youssefess.dev)
