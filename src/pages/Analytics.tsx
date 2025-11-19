import { useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import DescriptionIcon from '@mui/icons-material/Description';
import { usePotholeStore } from '../store/potholeStore';
import { StatsCards } from '../components/StatsCards';
import { generatePDFReport, generateExcelReport, generateCSVReport } from '../utils/reportGenerator';

export const Analytics = () => {
  const { filteredPotholes, stats, loading } = usePotholeStore();
  
  const [reportType, setReportType] = useState('executive');
  const [timeRange, setTimeRange] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedWard, setSelectedWard] = useState('all');
  const [visualizationType, setVisualizationType] = useState('overview');

  // Filter potholes for reporting
  const reportFilteredPotholes = useMemo(() => {
    return filteredPotholes.filter((pothole) => {
      const potholeDate = new Date(pothole.detected_at);
      const matchesDateRange =
        (!startDate || potholeDate >= new Date(startDate)) &&
        (!endDate || potholeDate <= new Date(endDate));
      const matchesWard = selectedWard === 'all' || pothole.ward === selectedWard;
      return matchesDateRange && matchesWard;
    });
  }, [filteredPotholes, startDate, endDate, selectedWard]);

  // Calculate stats for reporting
  const reportStats = useMemo(() => {
    const total = reportFilteredPotholes.length;
    const byStatus = {
      new: reportFilteredPotholes.filter((p) => p.status === 'new').length,
      in_progress: reportFilteredPotholes.filter((p) => p.status === 'in_progress').length,
      scheduled: reportFilteredPotholes.filter((p) => p.status === 'scheduled').length,
      completed: reportFilteredPotholes.filter((p) => p.status === 'completed').length,
    };
    const totalCost = reportFilteredPotholes.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0);
    const avgSeverity = reportFilteredPotholes.reduce((sum, p) => sum + p.severity, 0) / (total || 1);
    const completionRate = total > 0 ? (byStatus.completed / total) * 100 : 0;

    return {
      total,
      byStatus,
      totalCost,
      avgSeverity,
      completionRate,
    };
  }, [reportFilteredPotholes]);

  const handleGeneratePDF = () => {
    generatePDFReport(reportFilteredPotholes, reportStats, reportType, {
      startDate,
      endDate,
      ward: selectedWard,
    });
  };

  const handleGenerateExcel = () => {
    generateExcelReport(reportFilteredPotholes, reportStats, reportType, {
      startDate,
      endDate,
      ward: selectedWard,
    });
  };

  const handleGenerateCSV = () => {
    generateCSVReport(reportFilteredPotholes);
  };

  // Only calculate chart data after chartsReady is true
  const severityDistribution = [
    { name: 'Low (0-0.4)', value: filteredPotholes.filter(p => p.severity < 0.4).length, color: '#689f38' },
    { name: 'Medium (0.4-0.6)', value: filteredPotholes.filter(p => p.severity >= 0.4 && p.severity < 0.6).length, color: '#fbc02d' },
    { name: 'High (0.6-0.8)', value: filteredPotholes.filter(p => p.severity >= 0.6 && p.severity < 0.8).length, color: '#f57c00' },
    { name: 'Critical (0.8-1.0)', value: filteredPotholes.filter(p => p.severity >= 0.8).length, color: '#d32f2f' },
  ];

  // Heat map data - density calculation
  const heatMapData = useMemo(() => {
    const gridSize = 0.005; // ~0.5km grid
    const densityMap: Record<string, { x: number; y: number; density: number; severity: number }> = {};

    filteredPotholes.forEach(pothole => {
      const gridX = Math.floor(pothole.lng / gridSize) * gridSize;
      const gridY = Math.floor(pothole.lat / gridSize) * gridSize;
      const key = `${gridX},${gridY}`;

      if (!densityMap[key]) {
        densityMap[key] = { x: gridX, y: gridY, density: 0, severity: 0 };
      }
      densityMap[key].density += 1;
      densityMap[key].severity += pothole.severity;
    });

    return Object.values(densityMap).map(cell => ({
      ...cell,
      severity: cell.severity / cell.density, // Average severity
      x: parseFloat(cell.x.toFixed(4)),
      y: parseFloat(cell.y.toFixed(4)),
    }));
  }, [filteredPotholes]);

  // Ward comparison data
  const wardComparison = useMemo(() => {
    const wardStats: Record<string, { 
      ward: string; 
      total: number; 
      completed: number; 
      avgSeverity: number;
      totalCost: number;
      completionRate: number;
    }> = {};

    filteredPotholes.forEach(pothole => {
      const ward = pothole.ward || 'Unknown';
      if (!wardStats[ward]) {
        wardStats[ward] = { 
          ward, 
          total: 0, 
          completed: 0, 
          avgSeverity: 0,
          totalCost: 0,
          completionRate: 0
        };
      }
      wardStats[ward].total += 1;
      wardStats[ward].avgSeverity += pothole.severity;
      wardStats[ward].totalCost += pothole.estimated_repair_cost_cad;
      if (pothole.status === 'completed') {
        wardStats[ward].completed += 1;
      }
    });

    return Object.values(wardStats).map(ward => ({
      ...ward,
      avgSeverity: parseFloat((ward.avgSeverity / ward.total).toFixed(2)),
      completionRate: parseFloat(((ward.completed / ward.total) * 100).toFixed(1)),
      totalCost: parseFloat(ward.totalCost.toFixed(2)),
    })).sort((a, b) => b.total - a.total);
  }, [filteredPotholes]);

  // Cost vs Completion Analysis
  const costCompletionAnalysis = useMemo(() => {
    const statusGroups = {
      completed: filteredPotholes.filter(p => p.status === 'completed'),
      in_progress: filteredPotholes.filter(p => p.status === 'in_progress'),
      scheduled: filteredPotholes.filter(p => p.status === 'scheduled'),
      new: filteredPotholes.filter(p => p.status === 'new'),
    };

    return [
      {
        status: 'Completed',
        count: statusGroups.completed.length,
        totalCost: statusGroups.completed.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0),
        avgCost: statusGroups.completed.length > 0 
          ? statusGroups.completed.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0) / statusGroups.completed.length 
          : 0,
        efficiency: statusGroups.completed.length > 0 ? 100 : 0,
      },
      {
        status: 'In Progress',
        count: statusGroups.in_progress.length,
        totalCost: statusGroups.in_progress.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0),
        avgCost: statusGroups.in_progress.length > 0 
          ? statusGroups.in_progress.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0) / statusGroups.in_progress.length 
          : 0,
        efficiency: statusGroups.in_progress.length > 0 ? 65 : 0,
      },
      {
        status: 'Scheduled',
        count: statusGroups.scheduled.length,
        totalCost: statusGroups.scheduled.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0),
        avgCost: statusGroups.scheduled.length > 0 
          ? statusGroups.scheduled.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0) / statusGroups.scheduled.length 
          : 0,
        efficiency: statusGroups.scheduled.length > 0 ? 30 : 0,
      },
      {
        status: 'New',
        count: statusGroups.new.length,
        totalCost: statusGroups.new.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0),
        avgCost: statusGroups.new.length > 0 
          ? statusGroups.new.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0) / statusGroups.new.length 
          : 0,
        efficiency: 0,
      },
    ].map(item => ({
      ...item,
      totalCost: parseFloat(item.totalCost.toFixed(2)),
      avgCost: parseFloat(item.avgCost.toFixed(2)),
    }));
  }, [filteredPotholes]);

  // Road Condition Score by Area
  const roadConditionScore = useMemo(() => {
    const areaData: Record<string, {
      area: string;
      potholeCount: number;
      avgSeverity: number;
      completed: number;
      conditionScore: number;
    }> = {};

    filteredPotholes.forEach(pothole => {
      const area = pothole.ward || 'Unknown';
      if (!areaData[area]) {
        areaData[area] = {
          area,
          potholeCount: 0,
          avgSeverity: 0,
          completed: 0,
          conditionScore: 100,
        };
      }
      areaData[area].potholeCount += 1;
      areaData[area].avgSeverity += pothole.severity;
      if (pothole.status === 'completed') {
        areaData[area].completed += 1;
      }
    });

    return Object.values(areaData).map(area => {
      const avgSev = area.avgSeverity / area.potholeCount;
      const completionRate = area.completed / area.potholeCount;
      // Score: 100 - (pothole density penalty + severity penalty - completion bonus)
      const densityPenalty = Math.min(area.potholeCount * 2, 40);
      const severityPenalty = avgSev * 30;
      const completionBonus = completionRate * 20;
      const score = Math.max(0, Math.min(100, 100 - densityPenalty - severityPenalty + completionBonus));

      return {
        area: area.area,
        potholeCount: area.potholeCount,
        avgSeverity: parseFloat(avgSev.toFixed(2)),
        completionRate: parseFloat((completionRate * 100).toFixed(1)),
        conditionScore: parseFloat(score.toFixed(1)),
      };
    }).sort((a, b) => b.conditionScore - a.conditionScore);
  }, [filteredPotholes]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Analytics & Reports
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Comprehensive insights and exportable reports for city council and stakeholders
      </Typography>

      <StatsCards stats={stats} loading={loading} />

      {/* Report Configuration & Export Section */}
      <Paper sx={{ p: 3, mt: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Report Configuration & Export
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="executive">Executive Summary</MenuItem>
                <MenuItem value="detailed">Detailed Analysis</MenuItem>
                <MenuItem value="ward">Ward Breakdown</MenuItem>
                <MenuItem value="cost">Cost Analysis</MenuItem>
                <MenuItem value="completion">Completion Rate</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="annual">Annual</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Visualization Type</InputLabel>
              <Select
                value={visualizationType}
                label="Visualization Type"
                onChange={(e) => setVisualizationType(e.target.value)}
              >
                <MenuItem value="overview">Overview</MenuItem>
                <MenuItem value="geographic">Geographic Analysis</MenuItem>
                <MenuItem value="performance">Ward Performance</MenuItem>
                <MenuItem value="cost">Cost Analysis</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Ward</InputLabel>
              <Select
                value={selectedWard}
                label="Ward"
                onChange={(e) => setSelectedWard(e.target.value)}
              >
                <MenuItem value="all">All Wards</MenuItem>
                {[...Array(10)].map((_, i) => (
                  <MenuItem key={i + 1} value={`Ward ${i + 1}`}>
                    Ward {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Export Buttons */}
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGeneratePDF}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<TableViewIcon />}
            onClick={handleGenerateExcel}
          >
            Export Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            onClick={handleGenerateCSV}
          >
            Export CSV
          </Button>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
        Visual Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Heat Map - Pothole Density */}
        {(visualizationType === 'overview' || visualizationType === 'geographic') && (
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pothole Density Heat Map
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Geographic distribution showing hotspots of pothole concentration
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Longitude" 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => value.toFixed(3)}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Latitude" 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => value.toFixed(3)}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="density" 
                    range={[50, 500]} 
                    name="Density"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <Paper sx={{ p: 1.5 }}>
                            <Typography variant="body2">Density: {data.density} potholes</Typography>
                            <Typography variant="body2">Avg Severity: {data.severity.toFixed(2)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {data.y.toFixed(4)}, {data.x.toFixed(4)}
                            </Typography>
                          </Paper>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    name="Pothole Hotspots" 
                    data={heatMapData} 
                    fill="#d32f2f"
                    fillOpacity={0.6}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        )}

        {/* Ward Performance Comparison */}
        {(visualizationType === 'overview' || visualizationType === 'performance') && (
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ward Performance Comparison
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Comprehensive comparison across total detections, completion rate, and average severity
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={wardComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ward" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="total" fill="#1976d2" name="Total Potholes" />
                  <Bar yAxisId="left" dataKey="completed" fill="#2e7d32" name="Completed" />
                  <Bar yAxisId="right" dataKey="completionRate" fill="#f57c00" name="Completion Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        )}

        {/* Cost vs Completion Analysis */}
        {(visualizationType === 'overview' || visualizationType === 'cost') && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cost vs. Completion Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Repair costs and efficiency by status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costCompletionAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Average Cost' || name === 'Total Cost') {
                        return `$${value}`;
                      }
                      if (name === 'Efficiency') {
                        return `${value}%`;
                      }
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" fill="#1976d2" name="Count" />
                  <Bar yAxisId="left" dataKey="avgCost" fill="#f57c00" name="Average Cost" />
                  <Bar yAxisId="right" dataKey="efficiency" fill="#2e7d32" name="Efficiency %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        )}

        {/* Road Condition Score by Area */}
        {(visualizationType === 'overview' || visualizationType === 'performance') && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Road Condition Score by Area
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Composite score based on pothole density, severity, and completion rate (0-100)
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={roadConditionScore} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="area" width={100} />
                  <Tooltip 
                    content={({ payload }) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <Paper sx={{ p: 1.5 }}>
                            <Typography variant="subtitle2" fontWeight="bold">{data.area}</Typography>
                            <Typography variant="body2">Condition Score: {data.conditionScore}/100</Typography>
                            <Typography variant="body2">Potholes: {data.potholeCount}</Typography>
                            <Typography variant="body2">Avg Severity: {data.avgSeverity}</Typography>
                            <Typography variant="body2">Completion: {data.completionRate}%</Typography>
                          </Paper>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="conditionScore" 
                    name="Condition Score"
                    fill="#2e7d32"
                    label={{ position: 'right', formatter: (value: any) => `${value}/100` }}
                  >
                    {roadConditionScore.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.conditionScore >= 75 ? '#2e7d32' :
                          entry.conditionScore >= 50 ? '#fbc02d' :
                          entry.conditionScore >= 25 ? '#f57c00' : '#d32f2f'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        )}

        {/* Severity Distribution */}
        {(visualizationType === 'overview' || visualizationType === 'geographic') && (
        <Grid size={{ xs: 12, md: 6 }}>
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
        )}
      </Grid>
    </Box>
  );
};
