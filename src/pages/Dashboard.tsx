import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
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
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePotholeStore } from '../store/potholeStore';
import { potholeService } from '../services/api';
import { StatsCards } from '../components/StatsCards';
import { useNotification } from '../components/NotificationProvider';
import { formatDate, formatCurrency, getSeverityColor, getStatusColor, exportToCSV, calculateTrendData } from '../utils/helpers';

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    filteredPotholes,
    stats,
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

  const trendData = calculateTrendData(filteredPotholes);

  const statusData = [
    { name: 'New', value: filteredPotholes.filter(p => p.status === 'new').length, color: '#1976d2' },
    { name: 'In Progress', value: filteredPotholes.filter(p => p.status === 'in_progress').length, color: '#f57c00' },
    { name: 'Scheduled', value: filteredPotholes.filter(p => p.status === 'scheduled').length, color: '#9c27b0' },
    { name: 'Completed', value: filteredPotholes.filter(p => p.status === 'completed').length, color: '#2e7d32' },
  ];

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

  // Handle chart click - filter by status
  const handlePieChartClick = (data: any) => {
    const statusMap: Record<string, string> = {
      'New': 'new',
      'In Progress': 'in_progress',
      'Scheduled': 'scheduled',
      'Completed': 'completed',
    };
    const status = statusMap[data.name];
    if (status) {
      setFilters({ ...filters, status });
      showNotification(`Filtered by status: ${data.name}`, 'info');
    }
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

      <StatsCards stats={stats} loading={loading} />

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

      {/* Charts */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3} mb={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Detection Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={2} name="Detections" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Status Distribution
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              Click on a segment to filter by status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={handlePieChartClick}
                  style={{ cursor: 'pointer' }}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Data Table */}
      <Paper sx={{ mb: 4 }}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Pothole Detections
          </Typography>
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
                  <TableRow key={pothole.id} hover>
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
                    <TableCell align="center">
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
