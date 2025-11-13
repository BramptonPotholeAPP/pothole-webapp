import { useState, useMemo } from 'react';
import { Box, Typography, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { usePotholeStore } from '../store/potholeStore';
import { generatePDFReport, generateExcelReport, generateCSVReport } from '../utils/reportGenerator';

export const Reports = () => {
  const potholes = usePotholeStore((state) => state.potholes);
  
  const [reportType, setReportType] = useState('executive');
  const [timeRange, setTimeRange] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedWard, setSelectedWard] = useState('all');

  const filterPotholes = () => {
    return potholes.filter((pothole) => {
      const potholeDate = new Date(pothole.detected_at);
      const matchesDateRange =
        (!startDate || potholeDate >= new Date(startDate)) &&
        (!endDate || potholeDate <= new Date(endDate));
      const matchesWard = selectedWard === 'all' || pothole.ward === selectedWard;
      return matchesDateRange && matchesWard;
    });
  };

  const filteredPotholes = filterPotholes();

  const calculateStats = useMemo(() => {
    const total = filteredPotholes.length;
    const byStatus = {
      new: filteredPotholes.filter((p) => p.status === 'new').length,
      in_progress: filteredPotholes.filter((p) => p.status === 'in_progress').length,
      scheduled: filteredPotholes.filter((p) => p.status === 'scheduled').length,
      completed: filteredPotholes.filter((p) => p.status === 'completed').length,
    };
    const totalCost = filteredPotholes.reduce((sum, p) => sum + p.estimated_repair_cost_cad, 0);
    const avgSeverity =
      filteredPotholes.reduce((sum, p) => sum + p.severity, 0) / (total || 1);
    const completionRate = total > 0 ? (byStatus.completed / total) * 100 : 0;

    return {
      total,
      byStatus,
      totalCost,
      avgSeverity,
      completionRate,
    };
  }, [filteredPotholes]);

  const handleGeneratePDF = () => {
    generatePDFReport(filteredPotholes, calculateStats, reportType, {
      startDate,
      endDate,
      ward: selectedWard,
    });
  };

  const handleGenerateExcel = () => {
    generateExcelReport(filteredPotholes, calculateStats, reportType, {
      startDate,
      endDate,
      ward: selectedWard,
    });
  };

  const handleGenerateCSV = () => {
    generateCSVReport(filteredPotholes);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Advanced Reporting
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Generate comprehensive reports for city council and stakeholders
      </Typography>

      <Paper sx={{ p: 3, mt: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Report Configuration
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
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
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
        </Box>
      </Paper>

      {/* Stats Preview */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Report Preview
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AssessmentIcon color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Detections
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {calculateStats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Completion Rate
                  </Typography>
                </Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {calculateStats.completionRate.toFixed(1)}%
                  </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AttachMoneyIcon color="warning" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Cost
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  ${calculateStats.totalCost.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <TrendingUpIcon color="info" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Avg Severity
                  </Typography>
                </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {calculateStats.avgSeverity.toFixed(2)}
                  </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Status Breakdown */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Status Breakdown
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
          <Chip
            label={`New: ${calculateStats.byStatus.new}`}
            color="default"
            variant="outlined"
          />
          <Chip
            label={`In Progress: ${calculateStats.byStatus.in_progress}`}
            color="info"
            variant="outlined"
          />
          <Chip
            label={`Scheduled: ${calculateStats.byStatus.scheduled}`}
            color="warning"
            variant="outlined"
          />
          <Chip
            label={`Completed: ${calculateStats.byStatus.completed}`}
            color="success"
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Export Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Export Report
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Download your configured report in multiple formats
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGeneratePDF}
            sx={{ minWidth: 150 }}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<TableViewIcon />}
            onClick={handleGenerateExcel}
            sx={{ minWidth: 150 }}
          >
            Export Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            onClick={handleGenerateCSV}
            sx={{ minWidth: 150 }}
          >
            Export CSV
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
