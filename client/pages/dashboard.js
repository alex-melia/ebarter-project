import buildClient from '../api/build-client';
import Router from 'next/router';
import { Box, Toolbar, Container } from '@mui/material';
import AllItems from '../components/allitems';

const Dashboard = ({ currentUser, items }) => {
  return currentUser && currentUser.verified ? (
    <Container maxWidth='lg'>
      <Box component='main' sx={{ flexGrow: 1 }}>
        <Toolbar />
        <AllItems currentUser={currentUser} items={items} />
      </Box>
    </Container>
  ) : (
    Router.push('/')
  );
};

Dashboard.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/auth/currentuser');
  const { data: items } = await client.get('/api/items');

  return { data, items };
};

export default Dashboard;
