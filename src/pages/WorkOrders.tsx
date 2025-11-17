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
  Tabs,
  Tab,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useWorkOrderStore } from '../store/workOrderStore';
import type { WorkOrder } from '../types/workOrder';

export const WorkOrders = () => {
  const { workOrders, addWorkOrder, updateWorkOrder, deleteWorkOrder } = useWorkOrderStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    potholeId: '',
    priority: 'medium' as WorkOrder['priority'],
    estimatedCost: 0,
    estimatedHours: 0,
  });

  const handleOpenDialog = (workOrder?: WorkOrder) => {
    if (workOrder) {
      setEditingWorkOrder(workOrder);
      setFormData({
        title: workOrder.title,
        description: workOrder.description,
        potholeId: workOrder.potholeId,
        priority: workOrder.priority,
        estimatedCost: workOrder.estimatedCost,
        estimatedHours: workOrder.estimatedHours,
      });
    } else {
      setEditingWorkOrder(null);
      setFormData({
        title: '',
        description: '',
        potholeId: '',
        priority: 'medium',
        estimatedCost: 0,
        estimatedHours: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingWorkOrder(null);
  };

  const handleSubmit = () => {
    if (editingWorkOrder) {
      updateWorkOrder(editingWorkOrder.id, formData);
    } else {
      const newWorkOrder: WorkOrder = {
        id: `WO-${Date.now()}`,
        ...formData,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addWorkOrder(newWorkOrder);
    }
    handleCloseDialog();
  };

  const getStatusColor = (status: WorkOrder['status']) => {
    const colors = {
      draft: 'default',
      assigned: 'info',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] as any;
  };

  const getPriorityColor = (priority: WorkOrder['priority']) => {
    const colors = {
      low: 'default',
      medium: 'info',
      high: 'warning',
      critical: 'error',
    };
    return colors[priority] as any;
  };

  const filterWorkOrders = (status?: WorkOrder['status']) => {
    if (!status) return workOrders;
    return workOrders.filter((wo) => wo.status === status);
  };

  const getTabWorkOrders = () => {
    switch (currentTab) {
      case 0: return workOrders;
      case 1: return filterWorkOrders('draft');
      case 2: return filterWorkOrders('assigned');
      case 3: return filterWorkOrders('in_progress');
      case 4: return filterWorkOrders('completed');
      default: return workOrders;
    }
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
          Create Work Order
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
          <Tab label={`All (${workOrders.length})`} />
          <Tab label={`Draft (${filterWorkOrders('draft').length})`} />
          <Tab label={`Assigned (${filterWorkOrders('assigned').length})`} />
          <Tab label={`In Progress (${filterWorkOrders('in_progress').length})`} />
          <Tab label={`Completed (${filterWorkOrders('completed').length})`} />
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Assigned Crew</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Est. Cost</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Est. Hours</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getTabWorkOrders().map((workOrder) => (
              <TableRow key={workOrder.id}>
                <TableCell>{workOrder.id}</TableCell>
                <TableCell>{workOrder.title}</TableCell>
                <TableCell>
                  <Chip
                    label={workOrder.priority.toUpperCase()}
                    color={getPriorityColor(workOrder.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={workOrder.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(workOrder.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{workOrder.assignedCrewId || 'Unassigned'}</TableCell>
                <TableCell>${workOrder.estimatedCost.toFixed(2)}</TableCell>
                <TableCell>{workOrder.estimatedHours}h</TableCell>
                <TableCell>{new Date(workOrder.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(workOrder)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => deleteWorkOrder(workOrder.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {getTabWorkOrders().length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography color="text.secondary" py={3}>
                    No work orders found
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
            <AssignmentIcon />
            {editingWorkOrder ? 'Edit Work Order' : 'Create Work Order'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Pothole ID"
                value={formData.potholeId}
                onChange={(e) => setFormData({ ...formData, potholeId: e.target.value })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estimated Cost ($)"
                type="number"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) })}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estimated Hours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingWorkOrder ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
