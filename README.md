# Shot Puno - React Stack

A modern React application for managing Shot Puno drinking game sessions.

## Project Structure

This project has been converted to a modern React stack using:
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **React DOM** - DOM rendering

### Directory Layout

```
shotpuno/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── App.jsx              # Main React component
│   ├── App.css              # Consolidated styles
│   └── main.jsx             # React entry point
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── .gitignore               # Git ignore file
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:3000` with hot module replacement (HMR) enabled.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Features

- ✅ Add/remove players
- ✅ Cycle through players by clicking the name display
- ✅ Drag and drop to reorder players
- ✅ Touch drag support for mobile devices
- ✅ Elegant UI with gradient buttons and animations
- ✅ Vercel Analytics integration

## Converting from Vanilla JS

This codebase has been modernized from vanilla HTML/CSS/JS to React with the following improvements:

1. **State Management** - Uses React hooks (useState, useRef) for managing game state
2. **Component-Based** - Single App component managing all functionality
3. **Better Tooling** - Vite for faster builds and hot module replacement
4. **Proper Build Process** - Production-ready build optimization
5. **Module System** - ES6 modules with proper imports/exports

## Migration Notes

The original files (`index.js`, `index.jsx`, `*.css`) have been refactored into:
- **App.jsx** - Contains all React component logic
- **App.css** - Consolidated styles from all CSS files
- **main.jsx** - React entry point
- **index.html** - Moved to `public/` directory

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
