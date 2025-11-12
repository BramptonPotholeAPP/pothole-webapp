import { Box, Container, Typography, Button, Grid, Card, CardContent, alpha, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudIcon from '@mui/icons-material/Cloud';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const Home = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 48 }} />,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms automatically detect and classify potholes from road imagery with high accuracy.',
      color: theme.palette.primary.main,
    },
    {
      icon: <MapIcon sx={{ fontSize: 48 }} />,
      title: 'Interactive Mapping',
      description: 'Real-time geospatial visualization of all detected potholes across Brampton with severity indicators and status tracking.',
      color: theme.palette.secondary.main,
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 48 }} />,
      title: 'Advanced Analytics',
      description: 'Comprehensive insights, trend analysis, and predictive maintenance planning to optimize road repair operations.',
      color: theme.palette.info.main,
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48 }} />,
      title: 'Real-Time Monitoring',
      description: 'Live updates and notifications enable quick response times and efficient resource allocation for road maintenance.',
      color: theme.palette.success.main,
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with data encryption and reliable cloud infrastructure for continuous operation.',
      color: theme.palette.error.main,
    },
    {
      icon: <CloudIcon sx={{ fontSize: 48 }} />,
      title: 'Cloud-Based Platform',
      description: 'Accessible from anywhere with automatic backups, scalable infrastructure, and seamless integration capabilities.',
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 12,
          px: 3,
          borderRadius: 4,
          mb: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '0px 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              🚧 Brampton Pothole Detection System
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.95,
                fontWeight: 400,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              AI-Powered Road Infrastructure Monitoring for the City of Brampton
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 5,
                opacity: 0.9,
                fontSize: '1.1rem',
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              Leveraging cutting-edge computer vision and machine learning to automatically detect, 
              track, and manage road potholes across Brampton's infrastructure network.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/dashboard"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.9),
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                View Dashboard
              </Button>
              <Button
                component={RouterLink}
                to="/about"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                textAlign: 'center',
                py: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Typography variant="h3" fontWeight={800} color="primary.main">
                5
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Active Detections
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                textAlign: 'center',
                py: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            >
              <Typography variant="h3" fontWeight={800} color="success.main">
                98%
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Detection Accuracy
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                textAlign: 'center',
                py: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              }}
            >
              <Typography variant="h3" fontWeight={800} color="warning.main">
                24/7
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Real-Time Monitoring
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                textAlign: 'center',
                py: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              }}
            >
              <Typography variant="h3" fontWeight={800} color="info.main">
                10
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Wards Covered
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Powerful Features
          </Typography>
          <Typography variant="body1" color="text.secondary" fontSize="1.1rem">
            Everything you need to manage and monitor road infrastructure efficiently
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  border: `1px solid ${alpha(feature.color, 0.2)}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0px 12px 40px ${alpha(feature.color, 0.15)}`,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: alpha(feature.color, 0.1),
                      color: feature.color,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          py: 8,
          px: 3,
          borderRadius: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
            Explore the dashboard to see real-time pothole detections, analyze trends, and manage repair operations.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              size="large"
              startIcon={<DashboardIcon />}
              sx={{ px: 4 }}
            >
              Operations Dashboard
            </Button>
            <Button
              component={RouterLink}
              to="/map"
              variant="outlined"
              size="large"
              startIcon={<MapIcon />}
              sx={{ px: 4 }}
            >
              View Map
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
