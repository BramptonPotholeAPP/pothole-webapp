# 🚧 Brampton Pothole Detection Web Application# React + TypeScript + Vite



A modern, dynamic React-based web application for AI-powered pothole monitoring and management for the City of Brampton.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🌐 Live DemoCurrently, two official plugins are available:



**URL:** https://bramptonpotholeapp.github.io/pothole-webapp/- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## ✨ Features

## React Compiler

### 📊 Operations Dashboard

- Real-time statistics cards with total detections, costs, and status summariesThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- Advanced filtering by date range, status, severity, ward, and priority

- Interactive charts showing detection trends and status distribution## Expanding the ESLint configuration

- Comprehensive data table with all pothole details

- One-click CSV export for offline analysisIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:



### 🗺️ Interactive Map View```js

- Custom severity-coded markers on Leaflet mapexport default defineConfig([

- Real-time filtering by status and priority  globalIgnores(['dist']),

- Detailed popups with complete pothole information  {

- Sidebar with all detections for easy navigation    files: ['**/*.{ts,tsx}'],

- Fully responsive design for all devices    extends: [

      // Other configs...

### 📈 Analytics & Insights

- Detection and cost trend analysis over time      // Remove tseslint.configs.recommended and replace with this

- Ward distribution breakdown      tseslint.configs.recommendedTypeChecked,

- Cost analysis by status      // Alternatively, use this for stricter rules

- Severity distribution visualization      tseslint.configs.strictTypeChecked,

- Interactive, exportable charts      // Optionally, add this for stylistic rules

      tseslint.configs.stylisticTypeChecked,

## 🏗️ Technology Stack

      // Other configs...

- React 18 + TypeScript + Vite    ],

- Material-UI (MUI) v6    languageOptions: {

- Zustand (State Management)      parserOptions: {

- React Router v6        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- Recharts (Data Visualization)        tsconfigRootDir: import.meta.dirname,

- Leaflet + React-Leaflet (Maps)      },

- Axios + date-fns      // other options...

    },

## 🚀 Quick Start  },

])

```bash```

npm install

npm run dev      # Development serverYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

npm run build    # Production build

``````js

// eslint.config.js

Visit `http://localhost:5173` to view the app.import reactX from 'eslint-plugin-react-x'

import reactDom from 'eslint-plugin-react-dom'

## 📦 Project Structure

export default defineConfig([

```  globalIgnores(['dist']),

src/  {

├── components/     # Reusable UI components    files: ['**/*.{ts,tsx}'],

├── pages/         # Main application pages    extends: [

├── services/      # API client and data services      // Other configs...

├── store/         # Zustand state management      // Enable lint rules for React

├── types/         # TypeScript type definitions      reactX.configs['recommended-typescript'],

└── utils/         # Helper functions and utilities      // Enable lint rules for React DOM

```      reactDom.configs.recommended,

    ],

## 🔧 Configuration    languageOptions: {

      parserOptions: {

Create `.env` file:        project: ['./tsconfig.node.json', './tsconfig.app.json'],

```env        tsconfigRootDir: import.meta.dirname,

VITE_API_BASE_URL=https://your-api-endpoint.com      },

```      // other options...

    },

Without an API URL, the app uses built-in demo data with 5 sample potholes.  },

])

## 🎯 Key Features```


- **Dynamic Filtering**: Multi-criteria filtering with instant results
- **Data Visualization**: Line, bar, and pie charts for insights
- **Export**: CSV export with all data fields
- **Responsive**: Mobile-first, adaptive layouts
- **Type-Safe**: Full TypeScript implementation
- **Performance**: Code-splitting and optimized bundles

## 🚀 Deployment

Automatically deploys to GitHub Pages on push to `main` branch via GitHub Actions.

---

**Built for the City of Brampton**  
© 2025 - AI-Powered Road Infrastructure Monitoring
