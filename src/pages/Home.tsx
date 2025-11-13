import { Box, Container, Typography, Button, useTheme, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MapIcon from '@mui/icons-material/Map';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { keyframes } from '@mui/system';
import { useTranslation } from '../i18n/useTranslation';

export const Home = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Animations
  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `;

  const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  `;

  const fadeInUp = keyframes`
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  const stats = [
    { label: 'Response Time', value: '<24hrs', icon: <SpeedIcon /> },
    { label: 'Success Rate', value: '95%', icon: <CheckCircleIcon /> },
    { label: 'Active Reports', value: '1,247', icon: <TrendingUpIcon /> },
  ];

  const benefits = [
    {
      icon: <NotificationsActiveIcon sx={{ fontSize: 40 }} />,
      title: 'Get Instant Updates',
      description: 'Receive notifications about your report status and estimated repair time.',
      color: theme.palette.info.main,
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: 'Community Impact',
      description: 'Help make Brampton safer for everyone by reporting road hazards.',
      color: theme.palette.success.main,
    },
    {
      icon: <MapIcon sx={{ fontSize: 40 }} />,
      title: 'Track on Map',
      description: 'View your report and all others on an interactive map of Brampton.',
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  animation: `${fadeInUp} 0.8s ease-out`,
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  {t('home.title')}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.95,
                    fontWeight: 400,
                  }}
                >
                  {t('home.subtitle')}
                </Typography>

                {/* Animated Submit Button */}
                <Button
                  component={RouterLink}
                  to="/submit-pothole"
                  variant="contained"
                  size="large"
                  startIcon={<ReportProblemIcon />}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    animation: `${pulse} 2s ease-in-out infinite`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    '&:hover': {
                      bgcolor: 'white',
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('home.reportButton')}
                </Button>
              </Box>
            </Grid>

            {/* Stats Cards */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Grid container spacing={2}>
                {stats.map((stat, index) => (
                  <Grid size={{ xs: 12 }} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        animation: `${fadeInUp} 0.8s ease-out ${index * 0.2}s both`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 6 }}
        >
          {t('home.howItWorks')}
        </Typography>

        <Grid container spacing={4}>
          {[
            { step: '1', title: 'Report', desc: 'Take a photo and submit the location' },
            { step: '2', title: 'Track', desc: 'Get updates on repair status' },
            { step: '3', title: 'Fixed', desc: 'See the impact on your community' },
          ].map((item, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  animation: `${fadeInUp} 0.8s ease-out ${index * 0.2}s both`,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 700,
                    margin: '0 auto',
                    mb: 3,
                    animation: `${float} 3s ease-in-out ${index * 0.5}s infinite`,
                  }}
                >
                  {item.step}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            {t('home.benefits')}
          </Typography>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                      borderColor: benefit.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: benefit.color,
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            {t('home.cta')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
            {t('home.ctaDescription')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/submit"
              variant="contained"
              size="large"
              startIcon={<ReportProblemIcon />}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                bgcolor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {t('home.submitButton')}
            </Button>
            <Button
              component={RouterLink}
              to="/map"
              variant="outlined"
              size="large"
              startIcon={<MapIcon />}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {t('home.viewMapButton')}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
