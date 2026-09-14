# Drive Ease — Frontend

The React front-end for Drive Ease, a full-stack vehicle rental platform. Users can browse the car fleet, book a vehicle, manage their bookings, and sign in as an admin to oversee all reservations.

**Live app:** https://driveease-frontend-ten.vercel.app
**Backend repo:** [driveease-backend](https://github.com/madhanreddy466-droid/driveease-backend) · **Live API:** https://driveease-backend-lwsc.onrender.com

## Features

- **Browse & book** — view the available car fleet and book a vehicle with pickup/return details
- **User authentication** — sign up / sign in, with protected routes for logged-in users
- **My Bookings** — view and manage your own reservations
- **Admin panel** — separate admin authentication and protected admin routes for managing all bookings
- **Session-based auth** — communicates with the backend via credentialed fetch requests (cookies)

## Tech Stack

| Layer | Technology |
|---|---|
| Library | React 18 |
| Routing | React Router DOM 6 |
| Build tool | Vite |
| Styling | CSS |
| API layer | Native `fetch`, wrapped in a small typed API helper (`api.js`) |

## Project Structure

```
src/
├── components/      # Header, Footer, BookingModal, route guards
├── pages/           # Home, Cars, MyBookings, Signin/Signup, Admin, AdminSignin, About
├── context/         # AuthContext, AdminAuthContext
├── api.js           # Centralized fetch wrapper for backend calls
└── App.jsx           # Route definitions
```

## How to Run

1. Clone the repo:
   ```
   git clone https://github.com/madhanreddy466-droid/driveease-frontend.git
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set the backend API URL in a `.env` file:
   ```
   VITE_API_URL=http://localhost:9070
   ```
4. Start the dev server:
   ```
   npm run dev
   ```

## Notes

This frontend expects the [Drive Ease backend](https://github.com/madhanreddy466-droid/driveease-backend) to be running and reachable at the URL set in `VITE_API_URL`. By default it points to a deployed Render instance; update `.env` to point at your local backend during development.
