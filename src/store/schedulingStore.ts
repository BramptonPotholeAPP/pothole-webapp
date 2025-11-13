import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScheduleEntry, WeatherCondition, RouteOptimization, MaintenanceWindow } from '../types/scheduling';

interface SchedulingStore {
  schedules: ScheduleEntry[];
  weatherData: WeatherCondition[];
  routes: RouteOptimization[];
  maintenanceWindows: MaintenanceWindow[];

  // Schedule actions
  addSchedule: (schedule: ScheduleEntry) => void;
  updateSchedule: (id: string, updates: Partial<ScheduleEntry>) => void;
  deleteSchedule: (id: string) => void;
  getSchedulesByDate: (date: string) => ScheduleEntry[];
  getSchedulesByCrew: (crewId: string) => ScheduleEntry[];
  reschedule: (id: string, newDate: string, newStartTime: string) => void;

  // Weather actions
  addWeatherData: (weather: WeatherCondition) => void;
  getWeatherForDate: (date: string) => WeatherCondition | undefined;
  isSuitableForWork: (date: string) => boolean;

  // Route optimization
  addRoute: (route: RouteOptimization) => void;
  getRouteForCrew: (crewId: string, date: string) => RouteOptimization | undefined;

  // Maintenance windows
  addMaintenanceWindow: (window: MaintenanceWindow) => void;
  updateMaintenanceWindow: (id: string, updates: Partial<MaintenanceWindow>) => void;
  getActiveMaintenanceWindows: () => MaintenanceWindow[];
}

export const useSchedulingStore = create<SchedulingStore>()(
  persist(
    (set, get) => ({
      schedules: [],
      weatherData: [],
      routes: [],
      maintenanceWindows: [],

      addSchedule: (schedule) => {
        set((state) => ({
          schedules: [...state.schedules, schedule],
        }));
      },

      updateSchedule: (id, updates) => {
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }));
      },

      deleteSchedule: (id) => {
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
        }));
      },

      getSchedulesByDate: (date) => {
        return get().schedules.filter((s) => s.scheduledDate === date);
      },

      getSchedulesByCrew: (crewId) => {
        return get().schedules.filter((s) => s.crewId === crewId);
      },

      reschedule: (id, newDate, newStartTime) => {
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id
              ? { ...s, scheduledDate: newDate, startTime: newStartTime, status: 'rescheduled' }
              : s
          ),
        }));
      },

      addWeatherData: (weather) => {
        set((state) => ({
          weatherData: [...state.weatherData.filter((w) => w.date !== weather.date), weather],
        }));
      },

      getWeatherForDate: (date) => {
        return get().weatherData.find((w) => w.date === date);
      },

      isSuitableForWork: (date) => {
        const weather = get().weatherData.find((w) => w.date === date);
        return weather ? weather.suitable : true;
      },

      addRoute: (route) => {
        set((state) => ({
          routes: [
            ...state.routes.filter((r) => !(r.crewId === route.crewId && r.date === route.date)),
            route,
          ],
        }));
      },

      getRouteForCrew: (crewId, date) => {
        return get().routes.find((r) => r.crewId === crewId && r.date === date);
      },

      addMaintenanceWindow: (window) => {
        set((state) => ({
          maintenanceWindows: [...state.maintenanceWindows, window],
        }));
      },

      updateMaintenanceWindow: (id, updates) => {
        set((state) => ({
          maintenanceWindows: state.maintenanceWindows.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }));
      },

      getActiveMaintenanceWindows: () => {
        const now = new Date();
        return get().maintenanceWindows.filter((w) => {
          const endDate = new Date(w.endDate);
          return endDate >= now;
        });
      },
    }),
    {
      name: 'scheduling-storage',
    }
  )
);
