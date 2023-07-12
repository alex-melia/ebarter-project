import Router from 'next/router';
import { useState } from 'react';
import {
  Button,
  Typography,
  FormControl,
  TextField,
  Toolbar,
} from '@mui/material';

const UpdateUser = ({ currentUser, user }) => {
  const [f_name, setFName] = useState(user.f_name);
  const [l_name, setLName] = useState(user.l_name);

  const { doRequest, errors } = useRequest({
    url: '/api/users',
    method: 'put',
    body: {
      f_name,
      l_name,
    },
    onSuccess: () => Router.push(`/summary/profile/${user.id}`),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    doRequest();
  };

  return currentUser && currentUser.verified ? (
    <FormControl onSubmit={handleSubmit}>
      <Toolbar />
      <Typography variant='h3'>Update your profile</Typography>
      <br></br>
      <br></br>
      <br />
      <FormControl>
        <TextField
          value={f_name}
          onChange={(e) => setFName(e.target.value)}
          label='First Name'
          variant='outlined'
          required
        />
      </FormControl>
      <br />
      <FormControl>
        <TextField
          value={l_name}
          onChange={(e) => setLName(e.target.value)}
          label='Last Name'
          variant='outlined'
          required
        />
      </FormControl>
      <br />
      {errors}
      <br />
      <Button variant='outlined' onClick={handleSubmit}>
        Update User
      </Button>
    </FormControl>
  ) : (
    Router.push('/')
  );
};

UpdateUser.getInitialProps = async (context, client, currentUser) => {
  const { query } = context;
  const { data } = await client.get(`/api/users/${query.id}`);

  return { user: data };
};

export default UpdateUser;
