export interface ScheduleEntry {
  id: string;
  workOrderId: string;
  crewId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  estimatedDuration: number; // in hours
  actualDuration?: number;
  weather?: WeatherCondition;
  notes?: string;
}

export interface WeatherCondition {
  date: string;
  condition: 'clear' | 'cloudy' | 'rain' | 'snow' | 'extreme';
  temperature: number;
  precipitation: number;
  suitable: boolean;
  warning?: string;
}

export interface RouteOptimization {
  date: string;
  crewId: string;
  stops: RouteStop[];
  totalDistance: number; // in km
  totalDuration: number; // in hours
  optimizationScore: number;
}

export interface RouteStop {
  order: number;
  workOrderId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  estimatedArrival: string;
  estimatedDuration: number;
  distance: number; // from previous stop
}

export interface MaintenanceWindow {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: 'routine' | 'emergency' | 'seasonal' | 'planned';
  affectedAreas: string[];
  restrictions?: string[];
  priority: 'low' | 'medium' | 'high';
}
