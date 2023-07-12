import { Box, Toolbar } from '@mui/material';
import ItemList from '../../components/itemlist';

const Items = ({ currentUser, items }) => {
  return currentUser && currentUser.role === 'admin' ? (
    <div>
      <Box component='main' sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        {items && <ItemList currentUser={currentUser} items={items} />}
      </Box>
    </div>
  ) : (
    <div>
      <h1>Not signed in</h1>
    </div>
  );
};

Items.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/items');

  return { items: data };
};

export default Items;
