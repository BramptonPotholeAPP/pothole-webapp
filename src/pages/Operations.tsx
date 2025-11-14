import { Box, Typography } from '@mui/material';
import { WorkOrders } from './WorkOrders';

export const Operations = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
        Operations Management
      </Typography>

      <WorkOrders />
    </Box>
  );
};
