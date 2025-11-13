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
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { Pothole } from '../types/pothole';
import { usePotholeStore } from '../store/potholeStore';
import { potholeService } from '../services/api';
import { useNotification } from '../components/NotificationProvider';
import { formatDate, formatCurrency, getSeverityColor, getStatusColor, exportToCSV } from '../utils/helpers';
import { DashboardAlerts } from '../components/DashboardAlerts';

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

  const { showNotification } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Pothole>('detected_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

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

      {/* Priority Alerts */}
      <DashboardAlerts />

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
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
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
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
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
                    <TableCell>{pothole.id}</TableCell>
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
    </Box>
  );
};
