# EventHub MVC

An event-management application built with a straightforward MVC architecture. Organizers create and manage events, while attendees browse upcoming events and manage their registrations.

**Live application:** https://eventhub-mvc-q11u.onrender.com

## Stack

- Node.js, Express, EJS, and Bootstrap 5.3.8
- MySQL with `mysql2/promise`
- `express-session` sessions and `bcryptjs` password hashing
- Validation with `express-validator`
- Environment configuration with `dotenv`

## Local setup

1. Install Node.js and MySQL.
2. Install the project dependencies with `npm install`.
3. Run `database/schema.sql` in MySQL to create the `eventhub` database and tables.
4. Copy `.env.example` to `.env`, configure the database, and add a long random `SESSION_SECRET`.
5. Start the development server with `npm run dev`.

The application runs at `http://localhost:3000`. Use `npm start` for a regular production-style start.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP server port |
| `DB_HOST`, `DB_PORT` | MySQL host and port |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Database credentials and name |
| `DB_SSL` | Enable SSL when required by the provider |
| `DB_SSL_REJECT_UNAUTHORIZED` | Control SSL server verification |
| `DB_SSL_CA_BASE64` | Base64-encoded database CA certificate |
| `SESSION_SECRET` | Long secret used to protect sessions |
| `NODE_ENV` | Runtime environment |

Never commit real credentials to GitHub.

## Features

- Registration, login, logout, and `httpOnly` cookie sessions
- Organizer and attendee roles
- Event CRUD restricted to the owning organizer
- Attendee list for organizers
- Registration, cancellation, and personal registration history for attendees
- Protection against duplicate registrations and registration when an event is full

## Architecture

- `config` — database connection
- `models` — parameterized SQL queries
- `controllers` — page and action rules
- `middlewares` — authentication, permissions, and validation
- `routes` — application endpoints
- `views` — EJS pages
- `public` — public styles
- `database` — database creation script

## Deployment

The project is configured for Render and uses `process.env.PORT`. Configure every variable from `.env.example`. For Aiven MySQL, enable `DB_SSL`, provide the CA certificate through `DB_SSL_CA_BASE64`, and keep server verification enabled.

`render.yaml` supports Render Blueprints without storing private database values in the repository. For a multi-instance production deployment, replace the default session store with a persistent session store.
