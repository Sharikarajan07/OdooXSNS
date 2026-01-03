# GlobeTrotter Travel Planner

GlobeTrotter is a modern travel planning app built with Next.js, React, and Tailwind CSS. It allows users to create personalized itineraries, manage budgets, and explore destinations with a beautiful, responsive UI.

## Features
- Plan trips with multiple stops and activities
- Add, edit, and reorder stops and activities
- Activity suggestions and custom activity input
- Sidebar navigation for easy access
- Blue/cyan/indigo gradient theme
- Budget tracking and expense management
- Share trips with friends
- Timeline, List, and Calendar views for itineraries
- Mobile responsive design
- Mock data for demo purposes

## Tech Stack
- Next.js 16
- React 18
- Tailwind CSS
- shadcn/ui components
- Prisma (mocked)
- TypeScript
- pnpm

## Getting Started
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd OdooXSNS
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Run the development server:**
   ```bash
   pnpm dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure
```
OdooXSNS/
  app/                # Next.js app routes and pages
  components/         # Reusable UI components
  lib/                # Mock data, utilities
  prisma/             # Prisma schema (mocked)
  public/             # Static assets
  styles/             # Global styles
  ...
```

## Customization
- **Theme:** Easily change colors in `tailwind.config.js` and component styles.
- **Mock Data:** Update `lib/mock-data.ts` and `lib/travel-data.ts` for demo trips, stops, and activities.
- **Images:** Replace images in the `public/` folder for backgrounds and destinations.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is for demo and educational purposes only.
