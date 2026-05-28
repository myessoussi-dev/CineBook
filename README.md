# Online Cinema Booking Platform

## Overview

This project is a full-stack web application for cinema management and online movie reservations. It allows users to browse movies, create accounts, select seats, book tickets, and receive booking confirmation emails. The system integrates external movie data from the TMDB API and synchronizes it with a local database.

The application follows a decoupled architecture with a Spring Boot backend exposing REST APIs and a React (Vite) frontend client.

---

## Features

### Authentication and Authorization
- User registration and login
- JWT-based authentication
- Role-based access control using Spring Security
- Protected REST endpoints

### Movie Management
- Integration with TMDB API for movie data retrieval
- Automated synchronization of movies into the database
- Movie categorization (now playing, upcoming, etc.)

### Reservation System
- Seat selection for movie sessions
- Booking management per user
- Seat availability validation
- Reservation history per user

### Email Notifications
- Automatic email confirmation after reservation
- Includes full reservation details (movie, session, seats)

---

## Architecture

- Frontend: React (Vite)
- Backend: Spring Boot (REST API)
- Database: Relational database PostgreSQL 
- External API: TMDB API

The backend exposes secure REST endpoints consumed by the frontend. Authentication is handled using JWT tokens and Spring Security filters.

---

## Backend

Technologies:
- Java
- Spring Boot
- Spring Security
- JWT
- JPA / Hibernate
- Maven

Responsibilities:
- REST API development
- Authentication and authorization
- Business logic (reservations, seat management, movies)
- Database management
- TMDB API integration
- Email service integration

---

## Frontend

Technologies:
- React
- Vite
- JavaScript

Responsibilities:
- Movie browsing interface
- Seat selection UI
- Authentication pages (login/register)
- API communication with backend
- User session handling

---

## Main Workflow

### Movie Synchronization
Movie data is automatically fetched from TMDB API and synchronized with the local database to keep the catalog up to date.

### Reservation Flow
1. User selects a movie and session
2. User selects available seats
3. Reservation request is sent to backend
4. Backend validates seat availability and stores reservation
5. Confirmation email is sent to the user

---

## Security

- JWT-based stateless authentication
- Spring Security filters for request validation
- Protected API endpoints for authenticated users only

---

## Future Improvements

- Payment integration system
- Admin dashboard for managing movies and sessions
- Recommendation system
- Docker containerization
- CI/CD pipeline deployment

---

## Author

Youssef Essoussi
