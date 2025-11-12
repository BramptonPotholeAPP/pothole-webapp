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
  {
    id: 'PH-2025-0006',
    lat: 43.7289,
    lng: -79.7542,
    detected_at: '2025-11-07T13:20:00Z',
    severity: 0.55,
    estimated_repair_cost_cad: 280,
    status: 'new',
    source: 'dashcam-fleet-023',
    ward: 'Ward 1',
    road_name: 'Hurontario Street',
    priority: 'medium',
    description: 'Moderate pothole near shopping center',
  },
  {
    id: 'PH-2025-0007',
    lat: 43.7412,
    lng: -79.7189,
    detected_at: '2025-11-06T10:45:00Z',
    severity: 0.38,
    estimated_repair_cost_cad: 180,
    status: 'scheduled',
    source: 'iot-camera-mclaughlin',
    ward: 'Ward 5',
    road_name: 'McLaughlin Road',
    priority: 'low',
    description: 'Small surface crack',
  },
  {
    id: 'PH-2025-0008',
    lat: 43.6978,
    lng: -79.7445,
    detected_at: '2025-11-05T15:30:00Z',
    severity: 0.88,
    estimated_repair_cost_cad: 590,
    status: 'in_progress',
    source: 'iot-camera-steeles',
    ward: 'Ward 3',
    road_name: 'Steeles Avenue East',
    priority: 'critical',
    description: 'Deep pothole near highway entrance',
  },
  {
    id: 'PH-2025-0009',
    lat: 43.7567,
    lng: -79.7678,
    detected_at: '2025-11-04T08:15:00Z',
    severity: 0.72,
    estimated_repair_cost_cad: 410,
    status: 'completed',
    source: 'dashcam-fleet-089',
    ward: 'Ward 2',
    road_name: 'Sandalwood Parkway',
    priority: 'high',
    description: 'Repaired November 10, 2025',
  },
  {
    id: 'PH-2025-0010',
    lat: 43.7098,
    lng: -79.7234,
    detected_at: '2025-11-03T12:50:00Z',
    severity: 0.42,
    estimated_repair_cost_cad: 195,
    status: 'new',
    source: 'iot-camera-bramalea',
    ward: 'Ward 4',
    road_name: 'Bramalea Road',
    priority: 'low',
    description: 'Minor pavement deterioration',
  },
  {
    id: 'PH-2025-0011',
    lat: 43.7445,
    lng: -79.7890,
    detected_at: '2025-11-02T14:20:00Z',
    severity: 0.67,
    estimated_repair_cost_cad: 350,
    status: 'scheduled',
    source: 'dashcam-fleet-034',
    ward: 'Ward 6',
    road_name: 'Airport Road',
    priority: 'medium',
    description: 'Pothole near industrial area',
  },
  {
    id: 'PH-2025-0012',
    lat: 43.7189,
    lng: -79.7567,
    detected_at: '2025-11-01T09:40:00Z',
    severity: 0.93,
    estimated_repair_cost_cad: 720,
    status: 'new',
    source: 'iot-camera-queen-st',
    ward: 'Ward 1',
    road_name: 'Queen Street East',
    priority: 'critical',
    description: 'Severe road damage affecting multiple lanes',
  },
  {
    id: 'PH-2025-0013',
    lat: 43.6845,
    lng: -79.7712,
    detected_at: '2025-10-31T16:10:00Z',
    severity: 0.51,
    estimated_repair_cost_cad: 265,
    status: 'in_progress',
    source: 'dashcam-fleet-056',
    ward: 'Ward 7',
    road_name: 'Countryside Drive',
    priority: 'medium',
    description: 'Pothole in residential area',
  },
  {
    id: 'PH-2025-0014',
    lat: 43.7634,
    lng: -79.7423,
    detected_at: '2025-10-30T11:25:00Z',
    severity: 0.36,
    estimated_repair_cost_cad: 170,
    status: 'completed',
    source: 'iot-camera-mayfield',
    ward: 'Ward 8',
    road_name: 'Mayfield Road',
    priority: 'low',
    description: 'Repaired November 5, 2025',
  },
  {
    id: 'PH-2025-0015',
    lat: 43.7356,
    lng: -79.7089,
    detected_at: '2025-10-29T13:55:00Z',
    severity: 0.79,
    estimated_repair_cost_cad: 460,
    status: 'new',
    source: 'dashcam-fleet-078',
    ward: 'Ward 9',
    road_name: 'Torbram Road',
    priority: 'high',
    description: 'Large pothole near school zone',
  },
  {
    id: 'PH-2025-0016',
    lat: 43.6923,
    lng: -79.7345,
    detected_at: '2025-10-28T10:30:00Z',
    severity: 0.48,
    estimated_repair_cost_cad: 240,
    status: 'scheduled',
    source: 'iot-camera-Clark',
    ward: 'Ward 10',
    road_name: 'Clark Boulevard',
    priority: 'medium',
    description: 'Pothole near park entrance',
  },
  {
    id: 'PH-2025-0017',
    lat: 43.7501,
    lng: -79.7256,
    detected_at: '2025-10-27T15:15:00Z',
    severity: 0.84,
    estimated_repair_cost_cad: 520,
    status: 'in_progress',
    source: 'dashcam-fleet-091',
    ward: 'Ward 5',
    road_name: 'Ray Lawson Boulevard',
    priority: 'high',
    description: 'Deep pothole near bus stop',
  },
  {
    id: 'PH-2025-0018',
    lat: 43.7123,
    lng: -79.7823,
    detected_at: '2025-10-26T08:50:00Z',
    severity: 0.41,
    estimated_repair_cost_cad: 190,
    status: 'completed',
    source: 'iot-camera-goreway',
    ward: 'Ward 6',
    road_name: 'Goreway Drive',
    priority: 'low',
    description: 'Repaired November 8, 2025',
  },
  {
    id: 'PH-2025-0019',
    lat: 43.6789,
    lng: -79.7501,
    detected_at: '2025-10-25T12:35:00Z',
    severity: 0.69,
    estimated_repair_cost_cad: 380,
    status: 'new',
    source: 'dashcam-fleet-102',
    ward: 'Ward 7',
    road_name: 'Williams Parkway',
    priority: 'medium',
    description: 'Moderate pothole near hospital',
  },
  {
    id: 'PH-2025-0020',
    lat: 43.7678,
    lng: -79.7612,
    detected_at: '2025-10-24T14:45:00Z',
    severity: 0.95,
    estimated_repair_cost_cad: 780,
    status: 'new',
    source: 'iot-camera-castlemore',
    ward: 'Ward 8',
    road_name: 'Castlemore Road',
    priority: 'critical',
    description: 'Emergency repair needed - major road damage',
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
