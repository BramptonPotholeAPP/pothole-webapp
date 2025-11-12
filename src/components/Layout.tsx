import { AppBar, Box, Toolbar, Typography, Button, Container, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery, alpha, Badge } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/map', label: 'Map View', icon: <MapIcon /> },
    { path: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  ];

  const drawer = (
    <List>
      {navItems.map((item) => (
        <ListItem
          key={item.path}
          component={RouterLink}
          to={item.path}
          onClick={() => setDrawerOpen(false)}
          sx={{
            backgroundColor: location.pathname === item.path ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            borderLeft: location.pathname === item.path ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
            mb: 0.5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
        >
          <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'text.secondary' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.label}
            primaryTypographyProps={{
              fontWeight: location.pathname === item.path ? 600 : 400,
              color: location.pathname === item.path ? 'primary.main' : 'text.primary',
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                  borderRadius: 2,
                  p: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                🚧
              </Box>
              Brampton Pothole Detection
            </Typography>
          </Box>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    backgroundColor: location.pathname === item.path ? alpha(theme.palette.common.white, 0.15) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: 'background.paper',
          },
        }}
      >
        <Box sx={{ width: 280 }} role="presentation">
          <Toolbar sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
          }}>
            <Typography variant="h6" fontWeight={700}>Menu</Typography>
          </Toolbar>
          {drawer}
        </Box>
      </Drawer>

      <Container 
        maxWidth={false} 
        sx={{ 
          flex: 1, 
          py: 4, 
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          backgroundColor: 'background.default',
        }}
      >
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
          borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          © 2025 City of Brampton - AI-Powered Road Infrastructure Monitoring
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
          Built with React + TypeScript + Material-UI
        </Typography>
      </Box>
    </Box>
  );
};
