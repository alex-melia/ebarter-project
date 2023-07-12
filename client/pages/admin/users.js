import { Box, Toolbar } from '@mui/material';
import UserList from '../../components/userlist';

const Users = ({ currentUser, users }) => {
  const filteredUsers = users.filter(
    (user) => user.email !== 'admin@ebarter.com'
  );

  return currentUser && currentUser.role === 'admin' ? (
    <div>
      <Box component='main' sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        {filteredUsers && (
          <UserList currentUser={currentUser} users={filteredUsers} />
        )}
      </Box>
    </div>
  ) : (
    <div>
      <h1>Not signed in</h1>
    </div>
  );
};

Users.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/users');

  return { users: data };
};

export default Users;
