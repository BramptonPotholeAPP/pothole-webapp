import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { WorkOrders } from './WorkOrders';
import { CrewManagement } from './CrewManagement';
import { Scheduling } from './Scheduling';

export const Operations = () => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
        Operations Management
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, v) => setCurrentTab(v)}
          variant="fullWidth"
        >
          <Tab label="Work Orders" />
          <Tab label="Crews" />
          <Tab label="Scheduling" />
        </Tabs>
      </Paper>

      <Box>
        {currentTab === 0 && <WorkOrders />}
        {currentTab === 1 && <CrewManagement />}
        {currentTab === 2 && <Scheduling />}
      </Box>
    </Box>
  );
};
