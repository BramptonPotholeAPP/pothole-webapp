export interface WorkOrder {
  id: string;
  potholeId: string;
  title: string;
  description: string;
  status: 'draft' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  completedDate?: string;
  assignedCrewId?: string;
  estimatedCost: number;
  actualCost?: number;
  estimatedHours: number;
  actualHours?: number;
  materialsUsed?: Material[];
  equipmentUsed?: Equipment[];
  notes?: string;
}

export interface Crew {
  id: string;
  name: string;
  members: string[];
  supervisor: string;
  specializations: string[];
  availability: CrewAvailability[];
  status: 'available' | 'assigned' | 'on_leave';
  currentWorkOrderId?: string;
}

export interface CrewAvailability {
  date: string;
  available: boolean;
  reason?: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
}

export interface Equipment {
  id: string;
  name: string;
  hoursUsed: number;
  costPerHour: number;
  totalCost: number;
}

export interface TimeLog {
  id: string;
  workOrderId: string;
  crewId: string;
  date: string;
  hoursWorked: number;
  description: string;
  createdBy: string;
}

export interface CostLog {
  id: string;
  workOrderId: string;
  type: 'material' | 'equipment' | 'labor' | 'other';
  description: string;
  amount: number;
  date: string;
  createdBy: string;
}
