import { Box, Button, Toolbar } from '@mui/material';
import ByUserList from '../../components/byuserlist';

const Trades = ({ currentUser, items }) => {
  return currentUser && currentUser.verified ? (
    <div>
      <Box component='main' sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        <Button variant='contained' component='a' href='/summary/new-item'>
          New Item
        </Button>
        {items && <ByUserList currentUser={currentUser} items={items} />}
      </Box>
    </div>
  ) : (
    <div>
      <h1>Not signed in</h1>
    </div>
  );
};

Trades.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get(`/api/trades/byuser/${currentUser.id}`);

  return { trades: data };
};

export default Trades;
