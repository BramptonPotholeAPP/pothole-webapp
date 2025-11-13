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
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import { useWorkOrderStore } from '../store/workOrderStore';
import type { Crew } from '../types/workOrder';

export const CrewManagement = () => {
  const { crews, addCrew, updateCrew, getWorkOrdersByCrew } = useWorkOrderStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCrew, setEditingCrew] = useState<Crew | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    supervisor: '',
    members: '',
    specializations: '',
    status: 'available' as Crew['status'],
  });

  const handleOpenDialog = (crew?: Crew) => {
    if (crew) {
      setEditingCrew(crew);
      setFormData({
        name: crew.name,
        supervisor: crew.supervisor,
        members: crew.members.join(', '),
        specializations: crew.specializations.join(', '),
        status: crew.status,
      });
    } else {
      setEditingCrew(null);
      setFormData({
        name: '',
        supervisor: '',
        members: '',
        specializations: '',
        status: 'available',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCrew(null);
  };

  const handleSubmit = () => {
    const crewData = {
      name: formData.name,
      supervisor: formData.supervisor,
      members: formData.members.split(',').map((m) => m.trim()).filter(Boolean),
      specializations: formData.specializations.split(',').map((s) => s.trim()).filter(Boolean),
      status: formData.status,
      availability: [],
    };

    if (editingCrew) {
      updateCrew(editingCrew.id, crewData);
    } else {
      const newCrew: Crew = {
        id: `CREW-${Date.now()}`,
        ...crewData,
      };
      addCrew(newCrew);
    }
    handleCloseDialog();
  };

  const getStatusColor = (status: Crew['status']) => {
    const colors = {
      available: 'success',
      assigned: 'warning',
      on_leave: 'default',
    };
    return colors[status] as any;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Crew Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Crew
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {crews.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Crews
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {crews.filter((c) => c.status === 'available').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Available
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main" fontWeight="bold">
              {crews.filter((c) => c.status === 'assigned').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              On Assignment
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Crew Name</TableCell>
              <TableCell>Supervisor</TableCell>
              <TableCell>Members</TableCell>
              <TableCell>Specializations</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Active Work Orders</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {crews.map((crew) => {
              const activeWorkOrders = getWorkOrdersByCrew(crew.id);
              return (
                <TableRow key={crew.id}>
                  <TableCell>{crew.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{crew.name}</TableCell>
                  <TableCell>{crew.supervisor}</TableCell>
                  <TableCell>{crew.members.length} members</TableCell>
                  <TableCell>
                    {crew.specializations.map((spec) => (
                      <Chip key={spec} label={spec} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={crew.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(crew.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{activeWorkOrders.filter((wo) => wo.status !== 'completed').length}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenDialog(crew)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {crews.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary" py={3}>
                    No crews found. Add a crew to get started.
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
            <GroupIcon />
            {editingCrew ? 'Edit Crew' : 'Add Crew'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Crew Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Supervisor"
                value={formData.supervisor}
                onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Members (comma-separated)"
                value={formData.members}
                onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                placeholder="John Doe, Jane Smith, Mike Johnson"
                helperText="Enter crew member names separated by commas"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Specializations (comma-separated)"
                value={formData.specializations}
                onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                placeholder="Asphalt Repair, Concrete Work, Heavy Machinery"
                helperText="Enter specializations separated by commas"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCrew ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
