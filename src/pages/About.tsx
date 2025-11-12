import { Box, Container, Typography, Card, alpha, useTheme, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupsIcon from '@mui/icons-material/Groups';
import EngineeringIcon from '@mui/icons-material/Engineering';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export const About = () => {
  const theme = useTheme();

  const technologies = [
    {
      category: 'Frontend',
      items: ['React 18', 'TypeScript', 'Material-UI v7', 'React Router', 'Recharts', 'Leaflet Maps'],
    },
    {
      category: 'Backend (Optional)',
      items: ['FastAPI', 'Python', 'PostgreSQL', 'REST API', 'JWT Authentication'],
    },
    {
      category: 'AI & ML',
      items: ['Computer Vision', 'TensorFlow/PyTorch', 'YOLO Object Detection', 'Image Classification'],
    },
    {
      category: 'Infrastructure',
      items: ['GitHub Pages', 'GitHub Actions CI/CD', 'Cloud Storage', 'Automated Deployment'],
    },
  ];

  const features = [
    'AI-powered pothole detection from road imagery',
    'Real-time monitoring and status tracking',
    'Interactive geospatial mapping with Leaflet',
    'Comprehensive analytics and trend visualization',
    'Cost estimation for repair operations',
    'Severity classification (low, medium, high, critical)',
    'Ward-based organization and reporting',
    'Export functionality for CSV data reports',
    'Responsive design for desktop and mobile',
    'Secure authentication and role-based access',
  ];

  const benefits = [
    {
      icon: <SpeedIcon sx={{ fontSize: 48 }} />,
      title: 'Efficient Detection',
      description: 'Automated detection could reduce manual inspection requirements and enable faster identification of road defects.',
      color: theme.palette.primary.main,
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 48 }} />,
      title: 'Data-Driven Planning',
      description: 'Analytics tools provide insights that could support maintenance planning and resource allocation decisions.',
      color: theme.palette.secondary.main,
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: 'Proactive Monitoring',
      description: 'Systematic monitoring approach helps identify issues before they become significant safety concerns.',
      color: theme.palette.success.main,
    },
    {
      icon: <EngineeringIcon sx={{ fontSize: 48 }} />,
      title: 'Workflow Organization',
      description: 'Centralized system for tracking and managing road maintenance tasks with priority classification.',
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
          color: 'white',
          py: 8,
          px: 3,
          borderRadius: 4,
          mb: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight={800} gutterBottom>
            About This Prototype
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: '800px', mx: 'auto' }}>
            Demonstration Application for Road Infrastructure Monitoring
          </Typography>
        </Container>
      </Box>

      {/* Mission Statement */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Card
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            p: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
            <RocketLaunchIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              Project Overview
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            This is a proof-of-concept web application demonstrating the potential of AI-based road infrastructure 
            monitoring. The prototype showcases how computer vision and data management tools can be integrated 
            to support municipal road maintenance operations.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            The application uses sample data to demonstrate key features including detection visualization, 
            geospatial mapping, analytics dashboards, and administrative management interfaces. This prototype 
            serves as a foundation for evaluating the feasibility of such a system for the City of Brampton.
          </Typography>
        </Card>
      </Container>

      {/* How It Works */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" fontWeight={800} gutterBottom textAlign="center" mb={4}>
          System Workflow
        </Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                1
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Data Collection
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Road imagery captured from cameras or mobile devices for analysis
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                2
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                AI Processing
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Computer vision algorithms detect and classify potential road defects
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                3
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Data Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Detection records stored with location, severity, and status tracking
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                4
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Visualization
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dashboard interfaces for viewing and analyzing detection data
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" fontWeight={800} gutterBottom textAlign="center" mb={4}>
          Potential Benefits
        </Typography>
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid size={{ xs: 12, sm: 6 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  p: 3,
                  border: `1px solid ${alpha(benefit.color, 0.2)}`,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0px 8px 24px ${alpha(benefit.color, 0.15)}`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: alpha(benefit.color, 0.1),
                      color: benefit.color,
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features List */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Card elevation={0} sx={{ p: 4, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
            <GroupsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={700}>
              Platform Features
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Container>

      {/* Technology Stack */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" fontWeight={800} gutterBottom textAlign="center" mb={4}>
          Technology Stack
        </Typography>
        <Grid container spacing={4}>
          {technologies.map((tech, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  p: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom color="primary">
                  {tech.category}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  {tech.items.map((item, idx) => (
                    <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer CTA */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 6,
          px: 3,
          borderRadius: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <CloudQueueIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Built for the Future of Smart Cities
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 3, fontSize: '1.1rem' }}>
            This platform represents the next generation of municipal infrastructure management,
            combining artificial intelligence, cloud computing, and modern web technologies
            to create more efficient, responsive, and data-driven city operations.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2025 City of Brampton - AI-Powered Road Infrastructure Monitoring
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
