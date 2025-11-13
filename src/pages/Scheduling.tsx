import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useSchedulingStore } from '../store/schedulingStore';
import { useWorkOrderStore } from '../store/workOrderStore';
import type { ScheduleEntry } from '../types/scheduling';

export const Scheduling = () => {
  const {
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getWeatherForDate,
    isSuitableForWork,
  } = useSchedulingStore();
  const { workOrders, crews } = useWorkOrderStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleEntry | null>(null);
  const [formData, setFormData] = useState({
    workOrderId: '',
    crewId: '',
    scheduledDate: '',
    startTime: '',
    endTime: '',
    estimatedDuration: 0,
  });

  const handleOpenDialog = (schedule?: ScheduleEntry) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        workOrderId: schedule.workOrderId,
        crewId: schedule.crewId,
        scheduledDate: schedule.scheduledDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        estimatedDuration: schedule.estimatedDuration,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        workOrderId: '',
        crewId: '',
        scheduledDate: '',
        startTime: '08:00',
        endTime: '16:00',
        estimatedDuration: 4,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
  };

  const handleSubmit = () => {
    const workOrder = workOrders.find((wo) => wo.id === formData.workOrderId);
    if (!workOrder) return;

    const scheduleData = {
      workOrderId: formData.workOrderId,
      crewId: formData.crewId,
      scheduledDate: formData.scheduledDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      estimatedDuration: formData.estimatedDuration,
      status: 'scheduled' as const,
      location: {
        lat: 43.7315,
        lng: -79.7624,
        address: workOrder.description || 'TBD',
      },
    };

    if (editingSchedule) {
      updateSchedule(editingSchedule.id, scheduleData);
    } else {
      const newSchedule: ScheduleEntry = {
        id: `SCH-${Date.now()}`,
        ...scheduleData,
        weather: getWeatherForDate(formData.scheduledDate),
      };
      addSchedule(newSchedule);
    }
    handleCloseDialog();
  };

  const getStatusColor = (status: ScheduleEntry['status']) => {
    const colors = {
      scheduled: 'info',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'error',
      rescheduled: 'default',
    };
    return colors[status] as any;
  };

  const getCrewName = (crewId: string) => {
    const crew = crews.find((c) => c.id === crewId);
    return crew ? crew.name : 'Unknown';
  };

  const getWorkOrderTitle = (workOrderId: string) => {
    const wo = workOrders.find((w) => w.id === workOrderId);
    return wo ? wo.title : 'Unknown';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ ml: 'auto' }}
        >
          Schedule Repair
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {schedules.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Schedules
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="info.main" fontWeight="bold">
              {schedules.filter((s) => s.status === 'scheduled').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upcoming
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main" fontWeight="bold">
              {schedules.filter((s) => s.status === 'in_progress').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {schedules.filter((s) => s.status === 'completed').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Work Order</TableCell>
              <TableCell>Crew</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Weather</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => {
              const suitable = isSuitableForWork(schedule.scheduledDate);
              return (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.id}</TableCell>
                  <TableCell>{getWorkOrderTitle(schedule.workOrderId)}</TableCell>
                  <TableCell>{getCrewName(schedule.crewId)}</TableCell>
                  <TableCell>{new Date(schedule.scheduledDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {schedule.startTime} - {schedule.endTime}
                  </TableCell>
                  <TableCell>{schedule.estimatedDuration}h</TableCell>
                  <TableCell>
                    <Chip
                      label={schedule.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(schedule.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<WbSunnyIcon />}
                      label={suitable ? 'Suitable' : 'Check'}
                      color={suitable ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenDialog(schedule)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => deleteSchedule(schedule.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {schedules.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography color="text.secondary" py={3}>
                    No schedules found. Create a schedule to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarMonthIcon />
            {editingSchedule ? 'Edit Schedule' : 'Schedule Repair'}
          </Box>
        </DialogTitle>
        <DialogContent>
          {!isSuitableForWork(formData.scheduledDate) && formData.scheduledDate && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Weather conditions may not be suitable for work on this date. Consider rescheduling.
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Work Order</InputLabel>
                <Select
                  value={formData.workOrderId}
                  label="Work Order"
                  onChange={(e) => setFormData({ ...formData, workOrderId: e.target.value })}
                >
                  {workOrders
                    .filter((wo) => wo.status !== 'completed' && wo.status !== 'cancelled')
                    .map((wo) => (
                      <MenuItem key={wo.id} value={wo.id}>
                        {wo.id} - {wo.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Crew</InputLabel>
                <Select
                  value={formData.crewId}
                  label="Crew"
                  onChange={(e) => setFormData({ ...formData, crewId: e.target.value })}
                >
                  {crews
                    .filter((c) => c.status === 'available')
                    .map((crew) => (
                      <MenuItem key={crew.id} value={crew.id}>
                        {crew.name} ({crew.supervisor})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Scheduled Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Estimated Duration (hours)"
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseFloat(e.target.value) })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSchedule ? 'Update' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
