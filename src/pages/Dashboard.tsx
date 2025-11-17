import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  TablePagination,
  TableSortLabel,
  InputAdornment,
  IconButton,
  Tooltip as MuiTooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import type { Pothole } from '../types/pothole';
import { usePotholeStore } from '../store/potholeStore';
import { useWorkOrderStore } from '../store/workOrderStore';
import { useSchedulingStore } from '../store/schedulingStore';
import { potholeService } from '../services/api';
import { useNotification } from '../components/NotificationProvider';
import { formatDate, formatCurrency, getSeverityColor, getStatusColor, exportToCSV } from '../utils/helpers';
import type { WorkOrder } from '../types/workOrder';
import type { ScheduleEntry } from '../types/scheduling';

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    filteredPotholes,
    loading,
    error,
    filters,
    setPotholes,
    setStats,
    setLoading,
    setError,
    setFilters,
    clearFilters,
  } = usePotholeStore();

  const { addWorkOrder } = useWorkOrderStore();
  const { crews } = useWorkOrderStore();
  const { addSchedule } = useSchedulingStore();
  const { showNotification } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Pothole>('detected_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  
  // Action dialogs
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPothole, setSelectedPothole] = useState<Pothole | null>(null);
  const [workOrderDialog, setWorkOrderDialog] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<Pothole['status']>('new');
  const [workOrderForm, setWorkOrderForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as WorkOrder['priority'],
    estimatedCost: 500,
    estimatedHours: 4,
  });
  const [scheduleForm, setScheduleForm] = useState({
    crewId: '',
    scheduledDate: '',
    startTime: '08:00',
    endTime: '16:00',
    estimatedDuration: 4,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [potholesData, statsData] = await Promise.all([
          potholeService.getPotholes(),
          potholeService.getStats(),
        ]);
        setPotholes(potholesData);
        setStats(statsData);
        setError(null);
        showNotification('Data loaded successfully', 'success');
      } catch (err) {
        setError('Failed to load data');
        showNotification('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestSort = (property: keyof Pothole) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Navigate to map with specific pothole
  const handleViewOnMap = (pothole: Pothole) => {
    navigate('/map', { state: { selectedPothole: pothole } });
  };

  // Action menu handlers
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, pothole: Pothole) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedPothole(pothole);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCreateWorkOrder = () => {
    if (!selectedPothole) return;
    setWorkOrderForm({
      title: `Repair pothole at ${selectedPothole.road_name || 'Unknown Location'}`,
      description: `Pothole repair for ${selectedPothole.id}`,
      priority: selectedPothole.priority || 'medium',
      estimatedCost: selectedPothole.estimated_repair_cost_cad || 500,
      estimatedHours: 4,
    });
    setWorkOrderDialog(true);
    handleCloseMenu();
  };

  const handleScheduleRepair = () => {
    setScheduleDialog(true);
    handleCloseMenu();
  };

  const handleChangeStatus = () => {
    if (selectedPothole) {
      setNewStatus(selectedPothole.status);
      setStatusDialog(true);
    }
    handleCloseMenu();
  };

  const submitWorkOrder = () => {
    if (!selectedPothole) return;
    
    const newWorkOrder: WorkOrder = {
      id: `WO-${Date.now()}`,
      potholeId: selectedPothole.id,
      ...workOrderForm,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    addWorkOrder(newWorkOrder);
    showNotification('Work order created successfully', 'success');
    setWorkOrderDialog(false);
  };

  const submitSchedule = () => {
    if (!selectedPothole) return;
    
    const newSchedule: ScheduleEntry = {
      id: `SCH-${Date.now()}`,
      workOrderId: selectedPothole.id,
      ...scheduleForm,
      status: 'scheduled',
      location: {
        lat: selectedPothole.lat,
        lng: selectedPothole.lng,
        address: selectedPothole.road_name || 'Unknown',
      },
    };
    
    addSchedule(newSchedule);
    showNotification('Repair scheduled successfully', 'success');
    setScheduleDialog(false);
  };

  const submitStatusChange = () => {
    // In a real app, this would update the pothole status via API
    showNotification(`Status updated to ${newStatus}`, 'success');
    setStatusDialog(false);
  };

  // Filter by search query
  const searchFilteredPotholes = filteredPotholes.filter((pothole) => {
    const query = searchQuery.toLowerCase();
    return (
      pothole.id.toLowerCase().includes(query) ||
      pothole.ward?.toLowerCase().includes(query) ||
      pothole.road_name?.toLowerCase().includes(query) ||
      pothole.status.toLowerCase().includes(query)
    );
  });

  // Sort potholes
  const sortedPotholes = [...searchFilteredPotholes].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Paginate potholes
  const paginatedPotholes = sortedPotholes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && filteredPotholes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Operations Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filters & Search
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={2}>
          <TextField
            label="Since Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.since || ''}
            onChange={(e) => setFilters({ ...filters, since: e.target.value })}
            sx={{ minWidth: 180 }}
          />
          <TextField
            label="Until Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.until || ''}
            onChange={(e) => setFilters({ ...filters, until: e.target.value })}
            sx={{ minWidth: 180 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              label="Status"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority || ''}
              label="Priority"
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Overdue</InputLabel>
            <Select
              value={filters.overdue === true ? 'yes' : filters.overdue === false ? 'no' : ''}
              label="Overdue"
              onChange={(e) => setFilters({ ...filters, overdue: e.target.value === 'yes' ? true : e.target.value === 'no' ? false : undefined })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="yes">Overdue Only</MenuItem>
              <MenuItem value="no">Not Overdue</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Min Severity"
            type="number"
            inputProps={{ min: 0, max: 1, step: 0.1 }}
            value={filters.minSeverity || ''}
            onChange={(e) => setFilters({ ...filters, minSeverity: parseFloat(e.target.value) })}
            sx={{ minWidth: 140 }}
          />
          <Button variant="outlined" onClick={() => { clearFilters(); setSearchQuery(''); showNotification('Filters cleared', 'info'); }}>
            Clear Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => { exportToCSV(filteredPotholes); showNotification('CSV exported successfully', 'success'); }}
          >
            Export CSV
          </Button>
        </Box>
        <TextField
          fullWidth
          placeholder="Search by ID, ward, road name, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Data Table */}
      <Paper sx={{ mb: 4 }}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">
              Pothole Detections
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click on any row to view location on map
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {sortedPotholes.length} result{sortedPotholes.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'grey.100' }}>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleRequestSort('id')}
                  >
                    <strong>ID</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'detected_at'}
                    direction={orderBy === 'detected_at' ? order : 'asc'}
                    onClick={() => handleRequestSort('detected_at')}
                  >
                    <strong>Detected</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'severity'}
                    direction={orderBy === 'severity' ? order : 'asc'}
                    onClick={() => handleRequestSort('severity')}
                  >
                    <strong>Severity</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'estimated_repair_cost_cad'}
                    direction={orderBy === 'estimated_repair_cost_cad' ? order : 'asc'}
                    onClick={() => handleRequestSort('estimated_repair_cost_cad')}
                  >
                    <strong>Cost</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    <strong>Status</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell><strong>Priority</strong></TableCell>
                <TableCell><strong>Source</strong></TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'ward'}
                    direction={orderBy === 'ward' ? order : 'asc'}
                    onClick={() => handleRequestSort('ward')}
                  >
                    <strong>Ward</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPotholes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No potholes found matching your criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPotholes.map((pothole) => (
                  <TableRow 
                    key={pothole.id} 
                    hover
                    onClick={() => handleViewOnMap(pothole)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>{pothole.id}</TableCell>
                    <TableCell>{formatDate(pothole.detected_at)}</TableCell>
                    <TableCell>
                      {pothole.lat.toFixed(5)}, {pothole.lng.toFixed(5)}
                      {pothole.road_name && <><br /><Typography variant="caption">{pothole.road_name}</Typography></>}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pothole.severity.toFixed(2)}
                        size="small"
                        sx={{ backgroundColor: getSeverityColor(pothole.severity), color: 'white' }}
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(pothole.estimated_repair_cost_cad)}</TableCell>
                    <TableCell>
                      <Chip
                        label={pothole.status.replace('_', ' ')}
                        size="small"
                        sx={{ backgroundColor: getStatusColor(pothole.status), color: 'white' }}
                      />
                    </TableCell>
                    <TableCell>
                      {pothole.priority && (
                        <Chip
                          label={pothole.priority}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {pothole.source?.includes('dashcam') || pothole.source?.includes('fleet') 
                          ? `Dash-Cam ${pothole.source.split('-')[2] || ''}` 
                          : pothole.source?.includes('iot-camera') 
                            ? `IoT Camera` 
                            : pothole.source || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>{pothole.ward || '-'}</TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <MuiTooltip title="View on Map">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewOnMap(pothole)}
                        >
                          <LocationOnIcon fontSize="small" />
                        </IconButton>
                      </MuiTooltip>
                      <MuiTooltip title="Actions">
                        <IconButton 
                          size="small"
                          onClick={(e) => handleOpenMenu(e, pothole)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </MuiTooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={sortedPotholes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCreateWorkOrder}>
          <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
          Create Work Order
        </MenuItem>
        <MenuItem onClick={handleScheduleRepair}>
          <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
          Schedule Repair
        </MenuItem>
        <MenuItem onClick={handleChangeStatus}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Change Status
        </MenuItem>
      </Menu>

      {/* Create Work Order Dialog */}
      <Dialog open={workOrderDialog} onClose={() => setWorkOrderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Work Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Title"
                value={workOrderForm.title}
                onChange={(e) => setWorkOrderForm({ ...workOrderForm, title: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={workOrderForm.description}
                onChange={(e) => setWorkOrderForm({ ...workOrderForm, description: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={workOrderForm.priority}
                  label="Priority"
                  onChange={(e) => setWorkOrderForm({ ...workOrderForm, priority: e.target.value as any })}
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
                value={workOrderForm.estimatedCost}
                onChange={(e) => setWorkOrderForm({ ...workOrderForm, estimatedCost: parseFloat(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWorkOrderDialog(false)}>Cancel</Button>
          <Button onClick={submitWorkOrder} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Repair Dialog */}
      <Dialog open={scheduleDialog} onClose={() => setScheduleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Schedule Repair</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Crew</InputLabel>
                <Select
                  value={scheduleForm.crewId}
                  label="Crew"
                  onChange={(e) => setScheduleForm({ ...scheduleForm, crewId: e.target.value })}
                >
                  {crews.filter((c) => c.status === 'available').map((crew) => (
                    <MenuItem key={crew.id} value={crew.id}>
                      {crew.name} - {crew.supervisor}
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
                value={scheduleForm.scheduledDate}
                onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={scheduleForm.startTime}
                onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={scheduleForm.endTime}
                onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialog(false)}>Cancel</Button>
          <Button onClick={submitSchedule} variant="contained">Schedule</Button>
        </DialogActions>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value as any)}
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={submitStatusChange} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
