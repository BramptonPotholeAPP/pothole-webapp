import { Paper, Typography, Box, Alert, AlertTitle, Chip, Button, Divider } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { usePotholeStore } from '../store/potholeStore';
import { notificationService } from '../services/notificationService';
import { useEffect, useState } from 'react';

interface AlertItem {
  id: string;
  type: 'overdue' | 'high-priority' | 'critical';
  title: string;
  description: string;
  priority: string;
  daysInfo: string;
  potholeId: string;
}

export const DashboardAlerts = () => {
  const { potholes } = usePotholeStore();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const generateAlerts = () => {
      const newAlerts: AlertItem[] = [];

      potholes.forEach((pothole) => {
        // Skip completed potholes
        if (pothole.status === 'completed') return;

        const daysUntilDeadline = notificationService.getDaysUntilDeadline(pothole);

        // Critical priority alerts
        if (pothole.priority === 'critical') {
          newAlerts.push({
            id: `critical-${pothole.id}`,
            type: 'critical',
            title: 'CRITICAL Priority Pothole',
            description: `${pothole.road_name || 'Unknown Location'} - ${pothole.ward || 'No Ward'}`,
            priority: 'critical',
            daysInfo: daysUntilDeadline < 0 
              ? `${Math.abs(daysUntilDeadline)} days overdue` 
              : `Due in ${daysUntilDeadline} days`,
            potholeId: pothole.id,
          });
        }

        // High priority alerts
        if (pothole.priority === 'high' && daysUntilDeadline <= 1) {
          newAlerts.push({
            id: `high-${pothole.id}`,
            type: 'high-priority',
            title: 'High Priority Repair Urgent',
            description: `${pothole.road_name || 'Unknown Location'} - ${pothole.ward || 'No Ward'}`,
            priority: 'high',
            daysInfo: daysUntilDeadline < 0 
              ? `${Math.abs(daysUntilDeadline)} days overdue` 
              : `Due today`,
            potholeId: pothole.id,
          });
        }

        // Overdue repairs
        if (daysUntilDeadline < 0) {
          newAlerts.push({
            id: `overdue-${pothole.id}`,
            type: 'overdue',
            title: 'Overdue Repair',
            description: `${pothole.road_name || 'Unknown Location'} - ${pothole.priority?.toUpperCase() || 'MEDIUM'}`,
            priority: pothole.priority || 'medium',
            daysInfo: `${Math.abs(daysUntilDeadline)} days overdue`,
            potholeId: pothole.id,
          });
        }
      });

      // Sort by priority and overdue status
      newAlerts.sort((a, b) => {
        const priorityOrder = { critical: 0, overdue: 1, 'high-priority': 2 };
        return priorityOrder[a.type] - priorityOrder[b.type];
      });

      setAlerts(newAlerts);
    };

    generateAlerts();
  }, [potholes]);

  if (alerts.length === 0) {
    return null;
  }

  const criticalCount = alerts.filter((a) => a.type === 'critical').length;
  const overdueCount = alerts.filter((a) => a.type === 'overdue').length;
  const highPriorityCount = alerts.filter((a) => a.type === 'high-priority').length;

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderLeft: '6px solid',
        borderLeftColor: 'error.main',
        backgroundColor: 'error.lighter',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <ErrorIcon color="error" fontSize="large" />
          <Typography variant="h6" fontWeight="bold" color="error.dark">
            Priority Alerts
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          {criticalCount > 0 && (
            <Chip
              label={`${criticalCount} Critical`}
              color="error"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
          {overdueCount > 0 && (
            <Chip
              label={`${overdueCount} Overdue`}
              color="warning"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
          {highPriorityCount > 0 && (
            <Chip
              label={`${highPriorityCount} High Priority`}
              color="info"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" flexDirection="column" gap={2}>
        {alerts.slice(0, 5).map((alert) => (
          <Alert
            key={alert.id}
            severity={
              alert.type === 'critical' || alert.type === 'overdue' ? 'error' : 'warning'
            }
            icon={alert.type === 'critical' ? <ErrorIcon /> : <WarningIcon />}
            action={
              <Button size="small" color="inherit" variant="outlined">
                View
              </Button>
            }
          >
            <AlertTitle sx={{ fontWeight: 600 }}>{alert.title}</AlertTitle>
            <Typography variant="body2">{alert.description}</Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="caption" fontWeight={600}>
                {alert.daysInfo}
              </Typography>
              <Chip
                label={alert.priority.toUpperCase()}
                size="small"
                color={alert.type === 'critical' ? 'error' : 'warning'}
                sx={{ ml: 1 }}
              />
            </Box>
          </Alert>
        ))}
      </Box>

      {alerts.length > 5 && (
        <Box mt={2} textAlign="center">
          <Button variant="text" color="error">
            View All {alerts.length} Alerts
          </Button>
        </Box>
      )}
    </Paper>
  );
};
