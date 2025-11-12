import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Paper, Typography, Chip, Card, CardContent, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { usePotholeStore } from '../store/potholeStore';
import { potholeService } from '../services/api';
import { formatDate, formatCurrency, getSeverityColor, getStatusColor } from '../utils/helpers';
import type { Pothole } from '../types/pothole';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (severity: number) => {
  const color = getSeverityColor(severity);
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 10.4 12.5 28.5 12.5 28.5S25 22.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export const MapView = () => {
  const { filteredPotholes, filters, setPotholes, setStats, setLoading, setFilters } = usePotholeStore();
  const [mapCenter, setMapCenter] = useState<[number, number]>([43.7314, -79.7624]);
  const [loading, setLocalLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLocalLoading(true);
      try {
        const [potholesData, statsData] = await Promise.all([
          potholeService.getPotholes(),
          potholeService.getStats(),
        ]);
        setPotholes(potholesData);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load data');
      } finally {
        setLoading(false);
        setLocalLoading(false);
      }
    };

    fetchData();
  }, [setPotholes, setStats, setLoading]);

  const handlePotholeClick = (pothole: Pothole) => {
    setMapCenter([pothole.lat, pothole.lng]);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Interactive Map View
      </Typography>

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '300px 1fr' }} gap={3}>
        {/* Sidebar */}
        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
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
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority || ''}
                label="Priority"
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Paper>

          <Paper sx={{ p: 2, maxHeight: 'calc(100vh - 400px)', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Detections ({filteredPotholes.length})
            </Typography>
            {filteredPotholes.map((pothole) => (
              <Card
                key={pothole.id}
                sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                onClick={() => handlePotholeClick(pothole)}
              >
                <CardContent>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {pothole.id}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {pothole.road_name || 'Unknown Road'}
                  </Typography>
                  <Box mt={1} display="flex" gap={0.5} flexWrap="wrap">
                    <Chip
                      label={pothole.status.replace('_', ' ')}
                      size="small"
                      sx={{ backgroundColor: getStatusColor(pothole.status), color: 'white' }}
                    />
                    <Chip
                      label={`Severity: ${pothole.severity.toFixed(2)}`}
                      size="small"
                      sx={{ backgroundColor: getSeverityColor(pothole.severity), color: 'white' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Box>

        {/* Map */}
        <Paper sx={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}>
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={mapCenter} />
            {filteredPotholes.map((pothole) => (
              <Marker
                key={pothole.id}
                position={[pothole.lat, pothole.lng]}
                icon={createCustomIcon(pothole.severity)}
              >
                <Popup>
                  <Box sx={{ minWidth: 250 }}>
                    <Typography variant="h6" gutterBottom>
                      {pothole.id}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Road:</strong> {pothole.road_name || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Detected:</strong> {formatDate(pothole.detected_at)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Severity:</strong> {pothole.severity.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Estimated Cost:</strong> {formatCurrency(pothole.estimated_repair_cost_cad)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Status:</strong>{' '}
                      <Chip
                        label={pothole.status.replace('_', ' ')}
                        size="small"
                        sx={{ backgroundColor: getStatusColor(pothole.status), color: 'white' }}
                      />
                    </Typography>
                    {pothole.priority && (
                      <Typography variant="body2" gutterBottom>
                        <strong>Priority:</strong> {pothole.priority}
                      </Typography>
                    )}
                    {pothole.description && (
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {pothole.description}
                      </Typography>
                    )}
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Paper>
      </Box>
    </Box>
  );
};
