import { CardActionArea, Typography } from '@mui/material';
import Card from '@mui/material/Card';

import { Box } from '@mui/material';

const ByUserTrades = ({ currentUser, trades }) => {
  const list = trades.map((trade) => {
    return (
      <div key={trade.id}>
        <Card>
          <CardActionArea>
            <Box sx={{ p: 2, display: 'flex' }}>
              <Typography variant='h5'>Hello</Typography>
            </Box>
          </CardActionArea>
        </Card>
        {errors}
      </div>
    );
  });

  return currentUser && currentUser.verified ? (
    <div>{list}</div>
  ) : (
    <div>
      <h1>Fail</h1>
    </div>
  );
};

export default ByUserTrades;
