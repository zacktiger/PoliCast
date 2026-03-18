# PoliCast (GeoPulse)

**A full-stack geopolitical prediction market dashboard built with React, FastAPI, PostgreSQL, and APScheduler.**

PoliCast (UI branding: **GeoPulse**) is a portfolio-grade project that simulates how a forecasting platform can ingest probability updates, store time-series history, and present market-style insights through an interactive dashboard.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Repository Structure](#repository-structure)
- [Local Setup (Frontend + Backend)](#local-setup-frontend--backend)
- [API Reference](#api-reference)
- [Database Model](#database-model)
- [How the Prediction Engine Works](#how-the-prediction-engine-works)
- [Resume-Ready Section](#resume-ready-section)
- [Roadmap](#roadmap)
- [Known Limitations](#known-limitations)

---

## Project Overview

This project demonstrates an end-to-end forecasting product:

- A **React + Vite frontend** with market cards, category filters, search, and detailed probability charts.
- A **FastAPI backend** exposing prediction-market endpoints.
- A **PostgreSQL database** modeled with SQLAlchemy for questions, probability history, and signal drivers.
- A background **scheduler job** that periodically updates unresolved markets.

It is designed to be presentable on **GitHub** and useful for **resume/interview discussions**.

---

## Core Features

### Frontend (React)

- Dashboard of geopolitical prediction markets
- Category-based filtering (e.g., East Asia, Europe, Middle East)
- Keyword search for markets
- Market cards with:
  - YES/NO probabilities
  - 24h change indicator
  - sparkline trend preview
- Detail page with:
  - Multi-timeframe chart (24H / 7D / 30D / All)
  - Resolution info and update metadata
  - Driver panel and market info panel

### Backend (FastAPI)

- `GET /questions` for market summaries
- `GET /questions/{question_id}` for detailed market data
- `POST /questions/{question_id}/tick` to update a single market probability
- `GET /health` service health check

### Data & Automation

- SQLAlchemy ORM models for normalized persistence
- Probability history tracked over time
- APScheduler job updates all unresolved questions every 4 hours
- Seed script for bootstrapping sample questions and historical points

---

## Tech Stack

### Frontend

- React 19
- React Router
- Vite
- Chart.js + react-chartjs-2
- Custom CSS design system (dark, market-inspired UI)

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- APScheduler
- python-dotenv
- Uvicorn

---

## System Architecture

```mermaid
flowchart LR
    U[User] --> FE[React + Vite Frontend]
    FE -->|HTTP Requests| API[FastAPI API]
    API --> ORM[SQLAlchemy ORM]
    ORM --> DB[(PostgreSQL)]

    S[APScheduler Job\n(every 4h)] --> ORM
    ORM --> H[(Probability History)]
```

### Data Flow

1. Frontend requests market data from FastAPI.
2. API reads current question state + history from PostgreSQL.
3. Frontend normalizes decimals (0–1) into percentages (0–100) for display.
4. Scheduler periodically updates unresolved markets and appends history rows.

---

## Repository Structure

```text
.
├── backend/
│   ├── main.py                # FastAPI app entrypoint + startup scheduler
│   ├── routes.py              # API endpoints
│   ├── models.py              # SQLAlchemy models
│   ├── database.py            # DB engine/session config
│   ├── seed.py                # Seed sample questions/history
│   └── scheduler/
│       └── jobs.py            # Background probability update job
└── geopolitics-predictor/
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   └── QuestionDetail.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── CategoryBar.jsx
    │   │   ├── PredictionCard.jsx
    │   │   └── Sparkline.jsx
    │   ├── api/questions.js   # API client + response normalization
    │   └── utils/questionFormat.js
    └── package.json
```

---

## Local Setup (Frontend + Backend)

## 1) Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

## 2) Clone & open project

```bash
git clone https://github.com/zacktiger/PoliCast.git
cd PoliCast
```

## 3) Configure backend environment

Create a `.env` file in the **repository root**:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/geopolitics_predictor
```

## 4) Backend setup and run

```bash
python -m venv .venv
```

Activate venv:

- **Windows (cmd):**

```bat
.venv\Scripts\activate
```

- **macOS/Linux:**

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install fastapi "uvicorn[standard]" sqlalchemy psycopg2-binary apscheduler python-dotenv
```

Run API:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Seed sample data (in another terminal, from repo root):

```bash
python -m backend.seed
```

## 5) Frontend setup and run

```bash
cd geopolitics-predictor
npm install
```

Optional frontend `.env` (`geopolitics-predictor/.env`):

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start frontend dev server:

```bash
npm run dev
```

App URL: `http://localhost:5173`

---

## API Reference

Base URL (local): `http://localhost:8000`

### 1) Health Check

- **GET** `/health`

Response:

```json
{ "status": "ok" }
```

### 2) Get All Questions

- **GET** `/questions`

Response shape:

```json
[
  {
    "id": "uuid",
    "title": "Will China invade Taiwan before 2030?",
    "category": "East Asia",
    "current_probability": 0.18,
    "last_updated": "2026-03-18T19:00:00"
  }
]
```

### 3) Get Question Detail

- **GET** `/questions/{question_id}`

Includes:

- `probability_history` (latest records)
- `signal_drivers`
- `is_resolved`

### 4) Tick (Update) One Question

- **POST** `/questions/{question_id}/tick`

This simulates a new probability update (random ±0.02 bounded to 0.01–0.99), saves it to history, and returns updated probability.

---

## Database Model

### `questions`

- `id` (UUID, PK)
- `title` (Text)
- `category` (String)
- `current_probability` (Float)
- `last_updated` (DateTime)
- `is_resolved` (Boolean)

### `probability_history`

- `id` (UUID, PK)
- `question_id` (UUID, FK → questions.id)
- `probability` (Float)
- `recorded_at` (DateTime)

### `signal_drivers`

- `id` (UUID, PK)
- `question_id` (UUID, FK → questions.id)
- `reason` (Text)
- `impact` (Float)
- `created_at` (DateTime)

---

## How the Prediction Engine Works

Current implementation uses a **simulation model** (random walk):

- On each tick, every unresolved question gets a random delta in `[-0.02, +0.02]`.
- New probability is clamped between `0.01` and `0.99`.
- Updated value is written to `questions.current_probability`.
- A snapshot is appended into `probability_history`.

This creates realistic movement for UI/testing and can be replaced later with a true ML/LLM inference pipeline.

---

## Resume-Ready Section

### Resume Summary (1–2 lines)

Built a full-stack geopolitical forecasting platform using **React, FastAPI, PostgreSQL, and APScheduler**, featuring market-style probability tracking, historical analytics, and automated background updates.

### Resume Bullet Points (copy-ready)

- Engineered a full-stack prediction market app with a React/Vite frontend and FastAPI backend, supporting interactive dashboards, category/search filtering, and detailed market views.
- Designed REST APIs and SQLAlchemy data models for questions, probability history, and signal drivers, enabling structured time-series market tracking.
- Implemented scheduled backend jobs (APScheduler) to automate periodic market updates and persist historical probability movements in PostgreSQL.
- Built responsive data visualizations (Chart.js + custom sparklines) to present multi-timeframe trend analysis and market metadata clearly.

### Interview Talking Points

- How to model time-series market history in a relational schema.
- Trade-offs between polling, background jobs, and event-driven updates.
- Frontend normalization of backend probabilities for consistent UI rendering.
- How you would evolve the simulator into a real prediction engine.

---

## Roadmap

- Replace random simulation with real model inference + confidence intervals
- Add auth and user portfolios
- Add order book / trade simulation
- Add tests (unit + API integration + frontend component tests)
- Dockerize frontend + backend + database
- Add CI/CD pipeline and deployment manifests

---

## Known Limitations

- “AI model active” UI badge is present, but backend currently uses simulated updates.
- No authentication/authorization yet.
- No formal automated test suite in current version.
- Seed script currently populates questions + history; signal drivers may be empty unless added.

---

If you want, I can also generate:

1. a **short recruiter-facing README version** (minimal, high impact), and  
2. a **separate technical docs file** (`docs/ARCHITECTURE.md`) for deeper engineering detail.
