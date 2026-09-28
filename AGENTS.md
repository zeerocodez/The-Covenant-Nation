# TCN Children Church Uyo Management System - Agent Rules

## Core Design Philosophy
- **Register once, identify quickly, track safely, report automatically, follow up intentionally.**
- The system must be incredibly easy to use. A volunteer should not need technical knowledge to operate it.

## Architecture & Tech Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS (Vanilla CSS is allowed in `index.css` for custom animations/variables)
- **Icons:** Lucide React
- **Design Aesthetic:** The design must feel premium, modern, and beautiful. Do not build basic or generic MVPs. Use smooth gradients, micro-animations, glassmorphism, and clear visual hierarchies. 

## Development Guidelines
- Always ensure new UI elements are mobile-first and responsive. The system is used on Android phones, tablets, laptops, and desktops.
- Maintain a complete historical attendance record without overwriting data unless explicitly asked.
- Avoid modifying the data schema (`types.ts` and `initialData.ts`) unless absolutely necessary, as it serves as the core source of truth.
- When creating new UI components, verify that they integrate seamlessly into the main `App.tsx` layout and dashboard without breaking existing tabs.

## Safety & Security Rules
- Check-in systems must always enforce the generation and display of `sundayTagNumber` and `guardianPickupCode`.
- Allergies and medical notes must always be highlighted in red or with warning icons in the UI to ensure volunteer visibility.
