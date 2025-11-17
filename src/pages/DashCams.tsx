import { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

interface DashCam {
  id: string;
  vehicleId: string;
  vehicleType: 'snowplow' | 'bus' | 'patrol' | 'waste';
  vehiclePlate: string;
  status: 'active' | 'offline';
  lastSeen: string;
  location: string;
  detectedPotholes: number;
  feedType: 'live' | 'snapshot';
  signalStrength: number;
  detectedPotholeIds: string[]; // IDs of potholes detected by this camera
}

export const DashCams = () => {
  const [dashCams, setDashCams] = useState<DashCam[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate loading dash-cam data
    const mockData: DashCam[] = [
      {
        id: 'CAM-001',
        vehicleId: 'SP-2024-101',
        vehicleType: 'snowplow',
        vehiclePlate: 'BRT 1234',
        status: 'offline',
        lastSeen: new Date(Date.now() - 30 * 60000).toISOString(),
        location: 'Queen St & Main St',
        detectedPotholes: 18,
        feedType: 'live',
        signalStrength: 0,
        detectedPotholeIds: ['PH-2025-0001', 'PH-2025-0012', 'PH-2025-0021', 'PH-2025-0032', 'PH-2025-0041', 'PH-2025-0052', 'PH-2025-0061', 'PH-2025-0081', 'PH-2025-0092', 'PH-2025-0101', 'PH-2025-0112', 'PH-2025-0121', 'PH-2025-0132', 'PH-2025-0141', 'PH-2025-0022', 'PH-2025-0042', 'PH-2025-0062', 'PH-2025-0082'],
      },
      {
        id: 'CAM-002',
        vehicleId: 'BUS-2024-205',
        vehicleType: 'bus',
        vehiclePlate: 'BRT 5678',
        status: 'offline',
        lastSeen: new Date(Date.now() - 25 * 60000).toISOString(),
        location: 'Steeles Ave & Bramalea Rd',
        detectedPotholes: 12,
        feedType: 'snapshot',
        signalStrength: 0,
        detectedPotholeIds: ['PH-2025-0008', 'PH-2025-0028', 'PH-2025-0048', 'PH-2025-0068', 'PH-2025-0088', 'PH-2025-0108', 'PH-2025-0128', 'PH-2025-0148', 'PH-2025-0002', 'PH-2025-0024', 'PH-2025-0064', 'PH-2025-0084'],
      },
      {
        id: 'CAM-003',
        vehicleId: 'PD-2024-045',
        vehicleType: 'patrol',
        vehiclePlate: 'BRT 9012',
        status: 'offline',
        lastSeen: new Date(Date.now() - 40 * 60000).toISOString(),
        location: 'Airport Rd & Countryside Dr',
        detectedPotholes: 20,
        feedType: 'live',
        signalStrength: 0,
        detectedPotholeIds: ['PH-2025-0011', 'PH-2025-0031', 'PH-2025-0051', 'PH-2025-0071', 'PH-2025-0091', 'PH-2025-0111', 'PH-2025-0131', 'PH-2025-0151', 'PH-2025-0035', 'PH-2025-0055', 'PH-2025-0075', 'PH-2025-0095', 'PH-2025-0115', 'PH-2025-0135', 'PH-2025-0155', 'PH-2025-0018', 'PH-2025-0038', 'PH-2025-0058', 'PH-2025-0078', 'PH-2025-0098'],
      },
      {
        id: 'CAM-004',
        vehicleId: 'WC-2024-078',
        vehicleType: 'waste',
        vehiclePlate: 'BRT 3456',
        status: 'offline',
        lastSeen: new Date(Date.now() - 45 * 60000).toISOString(),
        location: 'Bovaird Dr & Chinguacousy Rd',
        detectedPotholes: 10,
        feedType: 'snapshot',
        signalStrength: 0,
        detectedPotholeIds: ['PH-2025-0003', 'PH-2025-0023', 'PH-2025-0043', 'PH-2025-0063', 'PH-2025-0123', 'PH-2025-0083', 'PH-2025-0103', 'PH-2025-0143', 'PH-2025-0033', 'PH-2025-0073'],
      },
      {
        id: 'CAM-005',
        vehicleId: 'SP-2024-102',
        vehicleType: 'snowplow',
        vehiclePlate: 'BRT 7890',
        status: 'offline',
        lastSeen: new Date(Date.now() - 60 * 60000).toISOString(),
        location: 'Sandalwood Pkwy & Torbram Rd',
        detectedPotholes: 25,
        feedType: 'live',
        signalStrength: 0,
        detectedPotholeIds: ['PH-2025-0009', 'PH-2025-0029', 'PH-2025-0049', 'PH-2025-0069', 'PH-2025-0089', 'PH-2025-0109', 'PH-2025-0129', 'PH-2025-0149', 'PH-2025-0015', 'PH-2025-0035', 'PH-2025-0055', 'PH-2025-0075', 'PH-2025-0095', 'PH-2025-0115', 'PH-2025-0135', 'PH-2025-0155', 'PH-2025-0037', 'PH-2025-0057', 'PH-2025-0077', 'PH-2025-0097', 'PH-2025-0027', 'PH-2025-0047', 'PH-2025-0067', 'PH-2025-0087', 'PH-2025-0107'],
      },
      {
        id: 'CAM-006',
        vehicleId: 'BUS-2024-206',
        vehicleType: 'bus',
        vehiclePlate: 'BRT 2468',
        status: 'offline',
        lastSeen: new Date(Date.now() - 120 * 60000).toISOString(),
        location: 'McLaughlin Rd & Williams Pkwy',
        detectedPotholes: 8,
        feedType: 'snapshot',
        signalStrength: 0,
        detectedPotholeIds: ['PH-2025-0019', 'PH-2025-0039', 'PH-2025-0059', 'PH-2025-0079', 'PH-2025-0099', 'PH-2025-0119', 'PH-2025-0139', 'PH-2025-0007'],
      },
      {
        id: 'CAM-007',
        vehicleId: 'PD-2024-046',
        vehicleType: 'patrol',
        vehiclePlate: 'BRT 1357',
        status: 'offline',
        lastSeen: new Date(Date.now() - 50 * 60000).toISOString(),
        location: 'Clark Blvd & Hansen Rd',
        detectedPotholes: 15,
        feedType: 'live',
        signalStrength: 0,
        detectedPotholeIds: ['PH-2025-0016', 'PH-2025-0036', 'PH-2025-0056', 'PH-2025-0076', 'PH-2025-0096', 'PH-2025-0116', 'PH-2025-0136', 'PH-2025-0017', 'PH-2025-0037', 'PH-2025-0057', 'PH-2025-0137', 'PH-2025-0077', 'PH-2025-0097', 'PH-2025-0117', 'PH-2025-0127'],
      },
      {
        id: 'CAM-008',
        vehicleId: 'WC-2024-079',
        vehicleType: 'waste',
        vehiclePlate: 'BRT 2479',
        status: 'offline',
        lastSeen: new Date(Date.now() - 90 * 60000).toISOString(),
        location: 'Creditview Rd & Wanless Dr',
        detectedPotholes: 7,
        feedType: 'snapshot',
        signalStrength: 0,
        detectedPotholeIds: ['PH-2025-0013', 'PH-2025-0033', 'PH-2025-0053', 'PH-2025-0073', 'PH-2025-0093', 'PH-2025-0113', 'PH-2025-0133'],
      },
    ];
    setDashCams(mockData);
  }, []);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'snowplow':
        return <LocalShippingIcon />;
      case 'bus':
        return <DirectionsBusIcon />;
      case 'patrol':
        return <LocalPoliceIcon />;
      case 'waste':
        return <DeleteIcon />;
      default:
        return <LocalShippingIcon />;
    }
  };

  const getVehicleTypeName = (type: string) => {
    switch (type) {
      case 'snowplow':
        return 'Snowplow';
      case 'bus':
        return 'Transit Bus';
      case 'patrol':
        return 'Patrol Car';
      case 'waste':
        return 'Waste Collection';
      default:
        return type;
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const now = new Date();
    const seen = new Date(lastSeen);
    const diffMs = now.getTime() - seen.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 80) return 'success';
    if (strength >= 50) return 'warning';
    return 'error';
  };

  // Filter dash-cams
  const filteredDashCams = dashCams.filter((cam) => {
    const matchesSearch =
      cam.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cam.status === statusFilter;
    const matchesVehicleType = vehicleTypeFilter === 'all' || cam.vehicleType === vehicleTypeFilter;

    return matchesSearch && matchesStatus && matchesVehicleType;
  });

  const activeCount = dashCams.filter(cam => cam.status === 'active').length;
  const offlineCount = dashCams.filter(cam => cam.status === 'offline').length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Connected Dash-Cams
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        City vehicles equipped with dash-cams automatically detect potholes using AI models. Live feeds and periodic snapshots are analyzed in real-time. 
        <strong>115 of 150 total potholes (76.7%)</strong> have been detected by these dash-cam systems.
      </Alert>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {activeCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Cameras
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="error.main" fontWeight="bold">
              {offlineCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Offline Cameras
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              {dashCams.reduce((sum, cam) => sum + cam.detectedPotholes, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dash-Cam Detections
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="secondary.main" fontWeight="bold">
              {dashCams.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Vehicles
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            placeholder="Search by vehicle ID, plate, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300, flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Vehicle Type</InputLabel>
            <Select
              value={vehicleTypeFilter}
              label="Vehicle Type"
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="snowplow">Snowplow</MenuItem>
              <MenuItem value="bus">Transit Bus</MenuItem>
              <MenuItem value="patrol">Patrol Car</MenuItem>
              <MenuItem value="waste">Waste Collection</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh">
            <IconButton color="primary" onClick={() => window.location.reload()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Dash-Cams Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Camera ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Vehicle</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Plate</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Last Seen</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Feed Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Signal</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Detections</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDashCams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No dash-cams found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredDashCams.map((cam) => (
                <TableRow key={cam.id} hover>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>
                    {cam.id}
                  </TableCell>
                  <TableCell>{cam.vehicleId}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getVehicleIcon(cam.vehicleType)}
                      {getVehicleTypeName(cam.vehicleType)}
                    </Box>
                  </TableCell>
                  <TableCell>{cam.vehiclePlate}</TableCell>
                  <TableCell>
                    <Chip
                      icon={cam.status === 'active' ? <VideocamIcon /> : <VideocamOffIcon />}
                      label={cam.status.toUpperCase()}
                      size="small"
                      color={cam.status === 'active' ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>{formatLastSeen(cam.lastSeen)}</TableCell>
                  <TableCell>{cam.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={cam.feedType === 'live' ? 'Live Feed' : 'Snapshot'}
                      size="small"
                      variant={cam.feedType === 'live' ? 'filled' : 'outlined'}
                      color={cam.feedType === 'live' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {cam.status === 'active' ? (
                      <Chip
                        label={`${cam.signalStrength}%`}
                        size="small"
                        color={getSignalColor(cam.signalStrength)}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="caption" fontWeight="bold">
                            Detected Potholes:
                          </Typography>
                          {cam.detectedPotholeIds.map((id) => (
                            <Typography key={id} variant="caption" display="block">
                              • {id}
                            </Typography>
                          ))}
                        </Box>
                      }
                      arrow
                    >
                      <Chip
                        label={cam.detectedPotholes}
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ cursor: 'pointer' }}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
