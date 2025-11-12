import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import BuildIcon from '@mui/icons-material/Build';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import type { Stats } from '../types/pothole';
import { formatCurrency } from '../utils/helpers';

interface StatsCardsProps {
  stats: Stats | null;
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: 'Total Detections',
      value: stats.total_detections,
      icon: <WarningIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      title: 'New & Pending',
      value: stats.new + stats.in_progress,
      icon: <BuildIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
      color: '#f57c00',
      bgColor: '#fff3e0',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
    },
    {
      title: 'Total Repair Cost',
      value: formatCurrency(stats.estimated_total_cost_cad),
      icon: <AttachMoneyIcon sx={{ fontSize: 40, color: '#d32f2f' }} />,
      color: '#d32f2f',
      bgColor: '#ffebee',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card
            elevation={3}
            sx={{
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold" color={card.color}>
                {card.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {card.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
