# StayEase – Hotel Reservation System

A responsive, premium-looking hotel reservation website built with **HTML5, CSS3 and JavaScript**. No frameworks and no backend are needed. All data is stored in the browser using LocalStorage.

**Course:** CSE 326 – Internet Programming (CA1 Project)

**Live demo:** https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/

## Features

**For guests**
- Search room availability by dates, guests and room category
- Four room types (Standard, Deluxe, Premium Suite, Family Suite) with prices in INR, amenities and live availability
- Booking form with validation, automatic booking ID and automatic price calculation
- Multi-room booking and payment method selection
- Double booking prevention for overlapping dates
- Printable invoice after every booking
- Contact form and fully responsive layout with a mobile menu

**For admins (login required)**
- Dashboard with total, confirmed, pending and cancelled reservations and total revenue
- Reservation management: search by guest name or booking ID, filter by room and status, view, confirm, edit and cancel
- Calendar view showing how many rooms are booked on each day

## Admin login

| Username | Password |
|---|---|
| `admin` | `admin123` |

The login is checked in the browser only, so it is meant for demonstration and is not real security.

## Tech stack

- HTML5 (semantic structure)
- CSS3 (Grid, Flexbox, media queries, animations)
- JavaScript (DOM, events, LocalStorage, form validation)

## Project structure

```
StayEase/
├── index.html   # page structure
├── style.css    # styling and responsive design
└── script.js    # booking logic, validation, dashboard, calendar
```

## How to run

1. Download or clone this repository.
2. Open `index.html` in any modern browser (Chrome, Edge or Firefox).
3. An internet connection is needed to load the room photos and fonts.

## How it works

- **Booking ID:** generated automatically in the format `SE1001`, `SE1002`, and so on.
- **Price:** nights × rooms × price per night.
- **Availability:** two stays overlap when each starts before the other ends. A room type is full when the overlapping bookings use all of its rooms.
- **Storage:** reservations are saved in LocalStorage, so they stay after a page refresh.

## Note

This is a frontend-only college project. Payment method selection is recorded in the booking, but no real payment is processed.

## Team

- Member 1 – contribution
- Member 2 – contribution
- Member 3 – contribution