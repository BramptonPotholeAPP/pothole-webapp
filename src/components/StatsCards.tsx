import { Grid, Card, CardContent, Typography, Box, CircularProgress, alpha, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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
  const theme = useTheme();

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
      icon: <WarningIcon sx={{ fontSize: 40 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      iconBg: alpha(theme.palette.primary.light, 0.2),
      trend: '+12%',
    },
    {
      title: 'New & Pending',
      value: stats.new + stats.in_progress,
      icon: <BuildIcon sx={{ fontSize: 40 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
      iconBg: alpha(theme.palette.warning.light, 0.2),
      trend: '+8%',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
      iconBg: alpha(theme.palette.success.light, 0.2),
      trend: '+24%',
    },
    {
      title: 'Total Repair Cost',
      value: formatCurrency(stats.estimated_total_cost_cad),
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      gradient: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
      iconBg: alpha(theme.palette.error.light, 0.2),
      trend: '-5%',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              background: card.gradient,
              color: 'white',
              borderRadius: 3,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0px 12px 40px rgba(0,0,0,0.2)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 50%)',
                pointerEvents: 'none',
              },
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box
                  sx={{
                    backgroundColor: card.iconBg,
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {card.icon}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    backgroundColor: alpha(theme.palette.common.white, 0.2),
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" fontWeight={600}>
                    {card.trend}
                  </Typography>
                </Box>
              </Box>
              <Typography 
                variant="h3" 
                component="div" 
                fontWeight={800}
                sx={{ 
                  mb: 0.5,
                  textShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {card.value}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 500,
                }}
              >
                {card.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
