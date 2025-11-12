import { useEffect } from 'react';
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
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePotholeStore } from '../store/potholeStore';
import { potholeService } from '../services/api';
import { StatsCards } from '../components/StatsCards';
import { formatDate, formatCurrency, getSeverityColor, getStatusColor, exportToCSV, calculateTrendData } from '../utils/helpers';

export const Dashboard = () => {
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
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setPotholes, setStats, setLoading, setError]);

  const trendData = calculateTrendData(filteredPotholes);

  const statusData = [
    { name: 'New', value: filteredPotholes.filter(p => p.status === 'new').length, color: '#1976d2' },
    { name: 'In Progress', value: filteredPotholes.filter(p => p.status === 'in_progress').length, color: '#f57c00' },
    { name: 'Scheduled', value: filteredPotholes.filter(p => p.status === 'scheduled').length, color: '#9c27b0' },
    { name: 'Completed', value: filteredPotholes.filter(p => p.status === 'completed').length, color: '#2e7d32' },
  ];

  const severityData = [
    { name: '0.0-0.4', value: filteredPotholes.filter(p => p.severity < 0.4).length, color: '#689f38' },
    { name: '0.4-0.6', value: filteredPotholes.filter(p => p.severity >= 0.4 && p.severity < 0.6).length, color: '#fbc02d' },
    { name: '0.6-0.8', value: filteredPotholes.filter(p => p.severity >= 0.6 && p.severity < 0.8).length, color: '#f57c00' },
    { name: '0.8-1.0', value: filteredPotholes.filter(p => p.severity >= 0.8).length, color: '#d32f2f' },
  ];

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
          Filters
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
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
          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => exportToCSV(filteredPotholes)}
          >
            Export CSV
          </Button>
        </Box>
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
            Pothole Detections ({filteredPotholes.length})
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Detected</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Severity</strong></TableCell>
                <TableCell><strong>Cost</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Priority</strong></TableCell>
                <TableCell><strong>Ward</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPotholes.map((pothole) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
