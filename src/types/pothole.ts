export interface Pothole {
  id: string;
  lat: number;
  lng: number;
  detected_at: string;
  severity: number;
  estimated_repair_cost_cad: number;
  status: 'new' | 'in_progress' | 'completed' | 'scheduled';
  source: string;
  image_url?: string;
  mask_geojson?: any;
  ward?: string;
  road_name?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface Stats {
  total_detections: number;
  new: number;
  in_progress: number;
  completed: number;
  scheduled: number;
  average_severity: number;
  estimated_total_cost_cad: number;
  high_priority_count: number;
}

export interface FilterOptions {
  status?: string;
  minSeverity?: number;
  since?: string;
  until?: string;
  ward?: string;
  priority?: string;
  overdue?: boolean;
}
