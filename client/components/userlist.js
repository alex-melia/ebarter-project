import { CardActionArea, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Router from 'next/router';
import useRequest from '../hooks/use-request';
import {
  Box,
  Stack,
  Divider,
  Button,
  Grid,
  Avatar,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

const UserList = ({ currentUser, users }) => {
  const [userId, setUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { doRequest, errors } = useRequest({
    url: `/api/users/${userId}`,
    method: 'delete',
    onSuccess: () => Router.push('/admin/users'),
  });

  useEffect(() => {
    if (userId) {
      doRequest();
    }
  }, [userId]);

  const handleDelete = async (userId) => {
    setUserId(userId);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.f_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.l_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const list = filteredUsers.map((user) => {
    return (
      <Grid item key={user.id} xs={12} sm={6} md={4}>
        <Card>
          <CardActionArea href={`/profile/${user.id}`}>
            <Box sx={{ p: 2, display: 'flex' }}>
              <Avatar src={user.profilePicture} />
              <Stack spacing={0.5} sx={{ marginLeft: 2 }}>
                <Typography variant='h6' component='div'>
                  {user.f_name} {user.l_name}
                </Typography>
                <Typography variant='body2'>Email: {user.email}</Typography>
              </Stack>
              <Divider />
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                sx={{ px: 2, py: 1, bgcolor: 'background.default' }}
              ></Stack>
            </Box>
          </CardActionArea>
          <Button onClick={() => handleDelete(user.id)}>Delete User</Button>
        </Card>
        {errors}
      </Grid>
    );
  });

  return currentUser && currentUser.role === 'admin' ? (
    <div>
      <TextField
        label='Search for a user'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={3}>
        {list}
      </Grid>
    </div>
  ) : (
    <div>
      <h1>Fail</h1>
      <p>{currentUser}</p>
    </div>
  );
};

export default UserList;
