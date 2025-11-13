import { create } from 'zustand';
import type { Pothole, Stats, FilterOptions } from '../types/pothole';

interface PotholeStore {
  potholes: Pothole[];
  filteredPotholes: Pothole[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  
  setPotholes: (potholes: Pothole[]) => void;
  setStats: (stats: Stats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: FilterOptions) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

export const usePotholeStore = create<PotholeStore>((set, get) => ({
  potholes: [],
  filteredPotholes: [],
  stats: null,
  loading: false,
  error: null,
  filters: {},

  setPotholes: (potholes) => {
    set({ potholes, filteredPotholes: potholes });
    get().applyFilters();
  },

  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => {
    set({ filters });
    get().applyFilters();
  },

  applyFilters: () => {
    const { potholes, filters } = get();
    let filtered = [...potholes];

    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    if (filters.minSeverity !== undefined) {
      filtered = filtered.filter((p) => p.severity >= filters.minSeverity!);
    }

    if (filters.since) {
      const sinceDate = new Date(filters.since);
      filtered = filtered.filter((p) => new Date(p.detected_at) >= sinceDate);
    }

    if (filters.until) {
      const untilDate = new Date(filters.until);
      filtered = filtered.filter((p) => new Date(p.detected_at) <= untilDate);
    }

    if (filters.ward) {
      filtered = filtered.filter((p) => p.ward === filters.ward);
    }

    if (filters.priority) {
      filtered = filtered.filter((p) => p.priority === filters.priority);
    }

    if (filters.overdue) {
      // Filter for overdue items (not completed and past deadline)
      const now = new Date();
      filtered = filtered.filter((p) => {
        if (p.status === 'completed') return false;
        
        const detectedDate = new Date(p.detected_at);
        const daysElapsed = Math.floor((now.getTime() - detectedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Deadline days based on priority
        const deadlineDays = 
          p.priority === 'critical' ? 1 :
          p.priority === 'high' ? 3 :
          p.priority === 'medium' ? 7 : 14;
        
        return daysElapsed > deadlineDays;
      });
    }

    set({ filteredPotholes: filtered });
  },

  clearFilters: () => {
    set({ filters: {}, filteredPotholes: get().potholes });
  },
}));
