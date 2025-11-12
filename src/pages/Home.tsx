import { Box, Container, Typography, Button, Grid, Card, CardContent, alpha, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const Home = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 48 }} />,
      title: 'AI-Based Detection',
      description: 'Demonstrates computer vision capabilities for identifying and classifying road surface defects from imagery.',
      color: theme.palette.primary.main,
    },
    {
      icon: <MapIcon sx={{ fontSize: 48 }} />,
      title: 'Interactive Mapping',
      description: 'Geospatial visualization using Leaflet maps to display detected potholes with location and severity data.',
      color: theme.palette.secondary.main,
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 48 }} />,
      title: 'Data Analytics',
      description: 'Dashboard with charts and statistics for visualizing detection trends and status distribution.',
      color: theme.palette.info.main,
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 48 }} />,
      title: 'Management Interface',
      description: 'Operational dashboard with filtering, search, and sorting capabilities for managing detection records.',
      color: theme.palette.success.main,
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
              Demonstration Prototype for Road Infrastructure Monitoring
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
              A proof-of-concept application demonstrating AI-based pothole detection and management capabilities for municipal road infrastructure.
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

      {/* About Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            What is This?
          </Typography>
          <Typography variant="body1" color="text.secondary" fontSize="1.1rem" sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
            This web application demonstrates a system for detecting and managing potholes on roads. 
            It uses sample data to show how cities could track road damage, see locations on a map, 
            and view statistics about repairs. The dashboard lets you filter and search through pothole 
            records, while the map shows where each one is located in Brampton. This is a prototype 
            to show what such a system could look like.
          </Typography>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Demonstration Features
          </Typography>
          <Typography variant="body1" color="text.secondary" fontSize="1.1rem">
            Core capabilities showcased in this prototype application
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
