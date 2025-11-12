import axios from 'axios';
import type { Pothole, Stats } from '../types/pothole';

// Default to demo data if no API is configured
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Demo data for when no API is available
const DEMO_POTHOLES: Pothole[] = [
  {
    id: 'PH-2025-0001',
    lat: 43.7314,
    lng: -79.7624,
    detected_at: '2025-11-10T14:25:00Z',
    severity: 0.82,
    estimated_repair_cost_cad: 480,
    status: 'new',
    source: 'iot-camera-queen-st',
    ward: 'Ward 1',
    road_name: 'Queen Street West',
    priority: 'high',
    description: 'Large pothole on main thoroughfare',
  },
  {
    id: 'PH-2025-0002',
    lat: 43.7523,
    lng: -79.7312,
    detected_at: '2025-11-11T09:15:00Z',
    severity: 0.65,
    estimated_repair_cost_cad: 320,
    status: 'in_progress',
    source: 'dashcam-fleet-012',
    ward: 'Ward 2',
    road_name: 'Main Street North',
    priority: 'medium',
    description: 'Medium-sized pothole near intersection',
  },
  {
    id: 'PH-2025-0003',
    lat: 43.6891,
    lng: -79.7598,
    detected_at: '2025-11-12T11:30:00Z',
    severity: 0.91,
    estimated_repair_cost_cad: 650,
    status: 'new',
    source: 'iot-camera-main-st',
    ward: 'Ward 3',
    road_name: 'Bovaird Drive East',
    priority: 'critical',
    description: 'Critical pothole causing vehicle damage',
  },
  {
    id: 'PH-2025-0004',
    lat: 43.7156,
    lng: -79.7456,
    detected_at: '2025-11-09T16:45:00Z',
    severity: 0.45,
    estimated_repair_cost_cad: 200,
    status: 'scheduled',
    source: 'iot-camera-kennedy-rd',
    ward: 'Ward 1',
    road_name: 'Kennedy Road South',
    priority: 'low',
    description: 'Minor surface damage',
  },
  {
    id: 'PH-2025-0005',
    lat: 43.7234,
    lng: -79.7123,
    detected_at: '2025-11-08T08:20:00Z',
    severity: 0.78,
    estimated_repair_cost_cad: 425,
    status: 'completed',
    source: 'dashcam-fleet-045',
    ward: 'Ward 4',
    road_name: 'Chinguacousy Road',
    priority: 'high',
    description: 'Repaired November 11, 2025',
  },
];

export const potholeService = {
  async getPotholes(): Promise<Pothole[]> {
    if (!API_BASE_URL) {
      // Return demo data if no API configured
      return Promise.resolve(DEMO_POTHOLES);
    }

    try {
      const response = await apiClient.get<Pothole[]>('/potholes');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using demo data');
      return DEMO_POTHOLES;
    }
  },

  async getPotholeById(id: string): Promise<Pothole | null> {
    if (!API_BASE_URL) {
      return DEMO_POTHOLES.find((p) => p.id === id) || null;
    }

    try {
      const response = await apiClient.get<Pothole>(`/potholes/${id}`);
      return response.data;
    } catch (error) {
      return DEMO_POTHOLES.find((p) => p.id === id) || null;
    }
  },

  async getStats(): Promise<Stats> {
    if (!API_BASE_URL) {
      const stats: Stats = {
        total_detections: DEMO_POTHOLES.length,
        new: DEMO_POTHOLES.filter((p) => p.status === 'new').length,
        in_progress: DEMO_POTHOLES.filter((p) => p.status === 'in_progress').length,
        completed: DEMO_POTHOLES.filter((p) => p.status === 'completed').length,
        scheduled: DEMO_POTHOLES.filter((p) => p.status === 'scheduled').length,
        average_severity: DEMO_POTHOLES.reduce((sum, p) => sum + p.severity, 0) / DEMO_POTHOLES.length,
        estimated_total_cost_cad: DEMO_POTHOLES.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0),
        high_priority_count: DEMO_POTHOLES.filter((p) => p.priority === 'high' || p.priority === 'critical').length,
      };
      return Promise.resolve(stats);
    }

    try {
      const response = await apiClient.get<Stats>('/stats');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch statistics');
    }
  },
};
