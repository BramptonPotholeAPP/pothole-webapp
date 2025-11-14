import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { Layout } from './components/Layout';
import { NotificationProvider } from './components/NotificationProvider';
import { EscalationMonitor } from './components/EscalationMonitor';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { MapView } from './pages/MapView';
import { Analytics } from './pages/Analytics';
import { SubmitPothole } from './pages/SubmitPothole';
import { Operations } from './pages/Operations';
import { DashCams } from './pages/DashCams';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <NotificationProvider>
          <EscalationMonitor />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/submit" element={<SubmitPothole />} />
              <Route path="/submit-pothole" element={<SubmitPothole />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/work-orders" element={<Operations />} />
              <Route path="/crews" element={<Operations />} />
              <Route path="/scheduling" element={<Operations />} />
              <Route path="/dashcams" element={<DashCams />} />
            </Routes>
          </Layout>
        </NotificationProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
