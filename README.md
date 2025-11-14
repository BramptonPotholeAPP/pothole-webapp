# Brampton Pothole Detection Web Application

A React-based web application for AI-powered pothole monitoring and management for the City of Brampton.

## Live Demo

https://bramptonpotholeapp.github.io/

## Features

- Real-time pothole detection dashboard
- Interactive map with severity-coded markers
- Analytics and trend visualization
- Dash-cam vehicle monitoring
- Advanced filtering and search
- CSV data export
- Multi-language support (English, French, Punjabi, Hindi)

## Technology Stack

- React 19 with TypeScript
- Material-UI v7
- Zustand for state management
- React Router v7
- Recharts for data visualization
- Leaflet for maps

## Quick Start

```bash
npm install
npm run dev      # Development server
npm run build    # Production build
```

Visit http://localhost:5173 to view the app.

## Configuration

Create .env file:

```env
VITE_API_BASE_URL=https://your-api-endpoint.com
```

Without an API URL, the app uses built-in demo data.

## Deployment

Automatically deploys to GitHub Pages on push to main branch via GitHub Actions.

## License

Built for the City of Brampton - AI-Powered Road Infrastructure Monitoring
