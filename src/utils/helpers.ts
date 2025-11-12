import { format } from 'date-fns';
import type { Pothole } from '../types/pothole';

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
};

export const getSeverityColor = (severity: number): string => {
  if (severity >= 0.8) return '#d32f2f'; // High - Red
  if (severity >= 0.6) return '#f57c00'; // Medium - Orange
  if (severity >= 0.4) return '#fbc02d'; // Low - Yellow
  return '#689f38'; // Very Low - Green
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'new':
      return '#1976d2'; // Blue
    case 'in_progress':
      return '#f57c00'; // Orange
    case 'scheduled':
      return '#9c27b0'; // Purple
    case 'completed':
      return '#2e7d32'; // Green
    default:
      return '#757575'; // Grey
  }
};

export const getPriorityColor = (priority?: string): string => {
  switch (priority) {
    case 'critical':
      return '#d32f2f'; // Red
    case 'high':
      return '#f57c00'; // Orange
    case 'medium':
      return '#fbc02d'; // Yellow
    case 'low':
      return '#689f38'; // Green
    default:
      return '#757575'; // Grey
  }
};

export const exportToCSV = (potholes: Pothole[], filename: string = 'potholes.csv') => {
  const headers = [
    'ID',
    'Date Detected',
    'Latitude',
    'Longitude',
    'Severity',
    'Repair Cost (CAD)',
    'Status',
    'Priority',
    'Ward',
    'Road Name',
    'Source',
    'Description',
  ];

  const rows = potholes.map((p) => [
    p.id,
    formatDate(p.detected_at),
    p.lat.toFixed(6),
    p.lng.toFixed(6),
    p.severity.toFixed(2),
    p.estimated_repair_cost_cad,
    p.status,
    p.priority || '',
    p.ward || '',
    p.road_name || '',
    p.source,
    p.description || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const calculateTrendData = (potholes: Pothole[]) => {
  const sortedByDate = [...potholes].sort(
    (a, b) => new Date(a.detected_at).getTime() - new Date(b.detected_at).getTime()
  );

  const dailyData: Record<string, { count: number; totalCost: number }> = {};

  sortedByDate.forEach((p) => {
    const date = format(new Date(p.detected_at), 'MMM dd');
    if (!dailyData[date]) {
      dailyData[date] = { count: 0, totalCost: 0 };
    }
    dailyData[date].count++;
    dailyData[date].totalCost += p.estimated_repair_cost_cad;
  });

  return Object.entries(dailyData).map(([date, data]) => ({
    date,
    count: data.count,
    cost: data.totalCost,
  }));
};
