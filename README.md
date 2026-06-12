# SlotWise MMU

SlotWise MMU is a responsive campus resource booking prototype built for the Shortcut Asia Internship Challenge 2026. Students can discover rooms and equipment, reserve available slots, manage bookings, and claim waitlisted resources. Administrators can monitor utilization and manage campus resources.

## Demo features

- Student and administrator demo sign-in
- Searchable and filterable resource catalogue
- Weekly availability and time-slot selection
- Booking conflict validation
- Booking confirmation, check-in, editing, and cancellation
- Waitlist positions, countdowns, and slot claiming
- Admin metrics, utilization charts, and resource management
- Persistent local demo data using `localStorage`
- Responsive desktop and mobile layouts

## Tech stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide icons
- Recharts
- Sonner notifications

## Run locally

Install [Node.js LTS](https://nodejs.org/) first, then run:

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Demo accounts

Use the **Student Demo** and **Admin Demo** buttons on the sign-in screen. No credentials or backend setup are required.

## Production build

```bash
npm run build
npm run preview
```

The project currently uses realistic local demo data so the complete product flow can be reviewed without external services. A production version would replace this layer with authenticated API and database services.
