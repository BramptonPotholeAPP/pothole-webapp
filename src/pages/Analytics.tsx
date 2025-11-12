import { useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePotholeStore } from '../store/potholeStore';
import { potholeService } from '../services/api';
import { StatsCards } from '../components/StatsCards';
import { calculateTrendData } from '../utils/helpers';

export const Analytics = () => {
  const { filteredPotholes, stats, setPotholes, setStats, setLoading, loading } = usePotholeStore();

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
      } catch (err) {
        console.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setPotholes, setStats, setLoading]);

  if (loading && filteredPotholes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const trendData = calculateTrendData(filteredPotholes);

  const wardData = Object.entries(
    filteredPotholes.reduce((acc, p) => {
      const ward = p.ward || 'Unknown';
      acc[ward] = (acc[ward] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const costByStatus = [
    {
      name: 'New',
      cost: filteredPotholes
        .filter(p => p.status === 'new')
        .reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0),
    },
    {
      name: 'In Progress',
      cost: filteredPotholes
        .filter(p => p.status === 'in_progress')
        .reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0),
    },
    {
      name: 'Scheduled',
      cost: filteredPotholes
        .filter(p => p.status === 'scheduled')
        .reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0),
    },
    {
      name: 'Completed',
      cost: filteredPotholes
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0),
    },
  ];

  const severityDistribution = [
    { name: 'Low (0-0.4)', value: filteredPotholes.filter(p => p.severity < 0.4).length, color: '#689f38' },
    { name: 'Medium (0.4-0.6)', value: filteredPotholes.filter(p => p.severity >= 0.4 && p.severity < 0.6).length, color: '#fbc02d' },
    { name: 'High (0.6-0.8)', value: filteredPotholes.filter(p => p.severity >= 0.6 && p.severity < 0.8).length, color: '#f57c00' },
    { name: 'Critical (0.8-1.0)', value: filteredPotholes.filter(p => p.severity >= 0.8).length, color: '#d32f2f' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Analytics & Insights
      </Typography>

      <StatsCards stats={stats} loading={loading} />

      <Grid container spacing={3}>
        {/* Detection Trend */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detection Trend Over Time
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
        </Grid>

        {/* Cost Trend */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Repair Cost Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="cost" stroke="#d32f2f" strokeWidth={2} name="Cost (CAD)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Ward Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detections by Ward
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={wardData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#1976d2" name="Detections" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Cost by Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estimated Cost by Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar dataKey="cost" fill="#f57c00" name="Cost (CAD)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Severity Distribution */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Severity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
