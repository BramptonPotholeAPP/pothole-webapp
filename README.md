# 🚧 Brampton Pothole Detection Web Application# 🚧 Brampton Pothole Detection Web Application



A modern, dynamic React-based web application for AI-powered pothole monitoring and management for the City of Brampton.A modern, dynamic React-based web application for AI-powered pothole monitoring and management for the City of Brampton.



## 🌐 Live Demo## 🌐 Live Demo



**URL:** https://bramptonpotholeapp.github.io/**URL:** https://bramptonpotholeapp.github.io/



## ✨ Features## ✨ Features



### 🏠 Home Page### 📊 Operations Dashboard

- Engaging hero section with mission statement

- Feature showcase with 6 key capabilities- Real-time statistics cards with total detections, costs, and status summariesThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- Quick stats overview (detections, accuracy, coverage)

- Call-to-action buttons for easy navigation- Advanced filtering by date range, status, severity, ward, and priority



### 📖 About Page- Interactive charts showing detection trends and status distribution## Expanding the ESLint configuration

- Detailed mission statement

- 4-step "How It Works" process explanation- Comprehensive data table with all pothole details

- Key benefits breakdown

- Complete feature list- One-click CSV export for offline analysisIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- Technology stack documentation



### 📊 Operations Dashboard

- Real-time statistics cards with total detections, costs, and status summaries### 🗺️ Interactive Map View

- Advanced filtering by date range, status, severity, ward, and priority

- Interactive charts showing detection trends and status distribution- Custom severity-coded markers on Leaflet map

- Comprehensive data table with search, sort, and pagination- Real-time filtering by status and priority

- One-click CSV export for offline analysis- Detailed popups with complete pothole information

- Toast notifications for user actions- Sidebar with all detections for easy navigation

- Fully responsive design for all devices### 📈 Analytics & Insights

### 🗺️ Interactive Map View

- Custom severity-coded markers on Leaflet map- Detection and cost trend analysis over time

- Real-time filtering by status and priority- Ward distribution breakdown

- Detailed popups with complete pothole information- Cost analysis by status

- Sidebar with all detections for easy navigation- Severity distribution visualization

- Fully responsive design for all devices- Interactive, exportable charts## 🏗️ Technology Stack



### 📈 Analytics & Insights- React 18 + TypeScript + Vite

- Detection and cost trend analysis over time- Material-UI (MUI) v7

- Ward distribution breakdown- Zustand (State Management)

- Cost analysis by status- React Router v6

- Severity distribution visualization- Recharts (Data Visualization)

- Interactive, exportable charts- Leaflet + React-Leaflet (Maps)

- Axios + date-fns

## 🏗️ Technology Stack

## 🚀 Quick Start

### Frontend

- React 18 + TypeScript```bash

- Material-UI (MUI) v7npm install

- Vite (Build Tool)npm run dev      # Development server

- React Router v6npm run build    # Production build

```

### State Management & Data

- Zustand (State Management)Visit `http://localhost:5173` to view the app.## 📦 Project Structure

- Axios (HTTP Client)

- date-fns (Date Utilities)export default defineConfig([



### Visualization```  globalIgnores(['dist']),

- Recharts (Charts & Analytics)

- Leaflet + React-Leaflet (Interactive Maps)src/  {



### Deployment├── components/     # Reusable UI components    files: ['**/*.{ts,tsx}'],

- GitHub Pages

- GitHub Actions (CI/CD)├── pages/         # Main application pages    extends: [



## 🚀 Quick Start├── services/      # API client and data services      // Other configs...



### Prerequisites├── store/         # Zustand state management      // Enable lint rules for React

- Node.js 20+ 

- npm or yarn├── types/         # TypeScript type definitions      reactX.configs['recommended-typescript'],



### Installation└── utils/         # Helper functions and utilities      // Enable lint rules for React DOM



```bash```      reactDom.configs.recommended,

# Clone the repository

git clone https://github.com/BramptonPotholeAPP/BramptonPotholeAPP.github.io.git    ],



# Navigate to project directory## 🔧 Configuration    languageOptions: {

cd BramptonPotholeAPP.github.io

      parserOptions: {

# Install dependencies

npm installCreate `.env` file:        project: ['./tsconfig.node.json', './tsconfig.app.json'],



# Start development server```env        tsconfigRootDir: import.meta.dirname,

npm run dev

```VITE_API_BASE_URL=https://your-api-endpoint.com      },



Visit `http://localhost:5173` to view the app.```      // other options...



### Build for Production    },



```bashWithout an API URL, the app uses built-in demo data with 5 sample potholes.  },

npm run build

```])



The production-ready files will be in the `dist` directory.## 🎯 Key Features```



## 📦 Project Structure

- **Dynamic Filtering**: Multi-criteria filtering with instant results

```- **Data Visualization**: Line, bar, and pie charts for insights

src/- **Export**: CSV export with all data fields

├── components/         # Reusable UI components- **Responsive**: Mobile-first, adaptive layouts

│   ├── Layout.tsx     # Main layout with navigation- **Type-Safe**: Full TypeScript implementation

│   ├── StatsCards.tsx # Statistics cards component- **Performance**: Code-splitting and optimized bundles

│   └── NotificationProvider.tsx  # Toast notifications

├── pages/             # Main application pages## 🚀 Deployment

│   ├── Home.tsx       # Landing page

│   ├── About.tsx      # About pageAutomatically deploys to GitHub Pages on push to `main` branch via GitHub Actions.

│   ├── Dashboard.tsx  # Operations dashboard

│   ├── MapView.tsx    # Interactive map---

│   └── Analytics.tsx  # Analytics & insights

├── services/          # API client and data services**Built for the City of Brampton**  

│   └── api.ts         # API client with demo data© 2025 - AI-Powered Road Infrastructure Monitoring

├── store/             # Zustand state management
│   └── potholeStore.ts  # Global state store
├── types/             # TypeScript type definitions
│   └── pothole.ts     # Data models
└── utils/             # Helper functions
    └── helpers.ts     # Utility functions
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-api-endpoint.com
```

**Note:** Without an API URL, the app uses built-in demo data with 5 sample potholes across Brampton.

### Vite Configuration

The app is configured to deploy to the root of GitHub Pages:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: '/',  // Root deployment for organization GitHub Pages
})
```

## 🎯 Key Features

- **Dynamic Filtering**: Multi-criteria filtering with instant results
- **Data Visualization**: Line, bar, and pie charts for insights
- **Export Functionality**: CSV export with all data fields
- **Responsive Design**: Mobile-first, adaptive layouts
- **Type-Safe**: Full TypeScript implementation
- **Performance Optimized**: Code-splitting and optimized bundles
- **User Feedback**: Toast notifications for all user actions
- **Search & Sort**: Advanced table features with pagination

## 🚀 Deployment

The application automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

### GitHub Actions Workflow

The deployment workflow:
1. Triggers on push to `main` branch
2. Installs dependencies
3. Builds the production bundle
4. Deploys to GitHub Pages

**Live URL:** https://bramptonpotholeapp.github.io/

## 📝 API Integration

The app is designed to work with an optional backend API. The demo mode includes:

- 5 sample pothole detections
- Realistic Brampton locations
- Various severity levels and statuses
- Cost estimates and ward assignments

To connect to a real API, set the `VITE_API_BASE_URL` environment variable.

## 🤝 Contributing

This project is maintained by the City of Brampton for internal infrastructure management.

## 📄 License

© 2025 City of Brampton - AI-Powered Road Infrastructure Monitoring

---

**Built for the City of Brampton**  
Transforming road maintenance through artificial intelligence and data-driven decision making.
