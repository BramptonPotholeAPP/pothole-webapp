import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkOrder, Crew, TimeLog, CostLog } from '../types/workOrder';

interface WorkOrderStore {
  workOrders: WorkOrder[];
  crews: Crew[];
  timeLogs: TimeLog[];
  costLogs: CostLog[];

  // Work Order actions
  addWorkOrder: (workOrder: WorkOrder) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
  getWorkOrderById: (id: string) => WorkOrder | undefined;
  getWorkOrdersByStatus: (status: WorkOrder['status']) => WorkOrder[];
  getWorkOrdersByCrew: (crewId: string) => WorkOrder[];

  // Crew actions
  addCrew: (crew: Crew) => void;
  updateCrew: (id: string, updates: Partial<Crew>) => void;
  getAvailableCrews: (date: string) => Crew[];
  assignCrewToWorkOrder: (workOrderId: string, crewId: string) => void;

  // Time tracking
  addTimeLog: (timeLog: TimeLog) => void;
  getTimeLogsByWorkOrder: (workOrderId: string) => TimeLog[];

  // Cost tracking
  addCostLog: (costLog: CostLog) => void;
  getCostLogsByWorkOrder: (workOrderId: string) => CostLog[];
  getTotalCost: (workOrderId: string) => number;
}

export const useWorkOrderStore = create<WorkOrderStore>()(
  persist(
    (set, get) => ({
      workOrders: [],
      crews: [],
      timeLogs: [],
      costLogs: [],

      addWorkOrder: (workOrder) => {
        set((state) => ({
          workOrders: [...state.workOrders, workOrder],
        }));
      },

      updateWorkOrder: (id, updates) => {
        set((state) => ({
          workOrders: state.workOrders.map((wo) =>
            wo.id === id ? { ...wo, ...updates, updatedAt: new Date().toISOString() } : wo
          ),
        }));
      },

      deleteWorkOrder: (id) => {
        set((state) => ({
          workOrders: state.workOrders.filter((wo) => wo.id !== id),
        }));
      },

      getWorkOrderById: (id) => {
        return get().workOrders.find((wo) => wo.id === id);
      },

      getWorkOrdersByStatus: (status) => {
        return get().workOrders.filter((wo) => wo.status === status);
      },

      getWorkOrdersByCrew: (crewId) => {
        return get().workOrders.filter((wo) => wo.assignedCrewId === crewId);
      },

      addCrew: (crew) => {
        set((state) => ({
          crews: [...state.crews, crew],
        }));
      },

      updateCrew: (id, updates) => {
        set((state) => ({
          crews: state.crews.map((crew) =>
            crew.id === id ? { ...crew, ...updates } : crew
          ),
        }));
      },

      getAvailableCrews: (date) => {
        return get().crews.filter((crew) => {
          if (crew.status !== 'available') return false;
          const availability = crew.availability.find((a) => a.date === date);
          return !availability || availability.available;
        });
      },

      assignCrewToWorkOrder: (workOrderId, crewId) => {
        set((state) => ({
          workOrders: state.workOrders.map((wo) =>
            wo.id === workOrderId
              ? { ...wo, assignedCrewId: crewId, status: 'assigned', updatedAt: new Date().toISOString() }
              : wo
          ),
          crews: state.crews.map((crew) =>
            crew.id === crewId
              ? { ...crew, status: 'assigned', currentWorkOrderId: workOrderId }
              : crew
          ),
        }));
      },

      addTimeLog: (timeLog) => {
        set((state) => ({
          timeLogs: [...state.timeLogs, timeLog],
        }));
      },

      getTimeLogsByWorkOrder: (workOrderId) => {
        return get().timeLogs.filter((log) => log.workOrderId === workOrderId);
      },

      addCostLog: (costLog) => {
        set((state) => ({
          costLogs: [...state.costLogs, costLog],
        }));
      },

      getCostLogsByWorkOrder: (workOrderId) => {
        return get().costLogs.filter((log) => log.workOrderId === workOrderId);
      },

      getTotalCost: (workOrderId) => {
        const costLogs = get().costLogs.filter((log) => log.workOrderId === workOrderId);
        return costLogs.reduce((sum, log) => sum + log.amount, 0);
      },
    }),
    {
      name: 'work-order-storage',
    }
  )
);
