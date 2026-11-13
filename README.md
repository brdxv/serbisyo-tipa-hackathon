# TaymPers: Time First

**A Community-Powered Platform for Accessible, Transparent, Accountable, and Reliable Services**

TaymPers is a map-first service-intelligence platform. It helps people know **where to go, when to go, what to expect, and which provider is more reliable** before they spend time, money, and effort on a service. Built by **TIPA Team 10** for the **DOST NAIRA Hackathon (CS Hackathon 2026)**, with a prototype focused on central Morong, Rizal.

> Team Leader & Presenter: **Ian Kurt G. Valencia** · 15-member team of developers, researchers/QA, UI/UX designers, and presenters.

## The Problem

*"Pagod ka na bang maghintay sa wala?"* (Are you tired of waiting with no certainty?)

Long and unpredictable queues, outdated or scattered service information, and services that turn out to be unavailable after you've already traveled. The problem isn't just waiting. It's accessing services without knowing what to expect.

## What TaymPers Does

Instead of plain star ratings, TaymPers turns community experiences into structured service information:

- **Explore map:** real Morong establishments on an OpenFreeMap/OpenStreetMap basemap, with search and filters
- **Service profiles:** operating hours, availability, estimated waiting and processing times, and peak hours
- **Community intelligence:** reliability, information accuracy, accessibility, and service quality indicators
- **TaymPers Score:** a composite service-reliability score built from community reports
- **Contribute & report:** share experiences, update service information, and flag issues
- **Moderation:** role-based workspaces for moderators and service providers

The real place names, addresses, and coordinates are kept separate from simulated prototype metrics (wait times, scores) used for the demo.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router |
| Maps | Leaflet, MapLibre GL, OpenFreeMap / OpenStreetMap |
| Backend | PHP 8.2+ JSON API |
| Database | PostgreSQL |
| Media | Wikimedia Commons–sourced establishment images |

## Repository Structure

```text
apps/web     React + Vite + Tailwind frontend
apps/api     PHP JSON API (built-in PHP server for local dev)
database     PostgreSQL schema and seed data
data         verified Morong real-place dataset
assets       brand, establishment, and UI assets
```

## Running Locally

```bash
npm install
npm run dev          # starts the Vite frontend and the PHP API (localhost:8000) together
```

Requires Node.js 20+ and PHP 8.2+. On Windows you can also use `RUN_SERBISYO.bat`. Copy `apps/web/.env.example` and `apps/api/.env.example` to `.env` and fill in your local PostgreSQL settings.

## Project Documentation

Planning documents are kept in the repo root: `PROJECT_CONTEXT.md` (vision and problem), `PRODUCT_SCOPE.md` (MVP scope), `TECHNICAL_PLAN.md` (architecture and scoring), `DESIGN_BLUEPRINT.md` and `USER_FLOWS_UI.md` (UI/UX), `TEAM_WORKPLAN.md` (roles), `QA_RESEARCH_PITCH.md` (research and pitch), and `TAYMPERS_DEMO_GUIDE.md` (demo flow).

> Originally developed under the working name **SerbisYO**.
