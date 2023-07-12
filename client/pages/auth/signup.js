import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import {
  TextField,
  Typography,
  Button,
  Container,
  Box,
  Grid,
} from '@mui/material';
import Link from 'next/link';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [f_name, setFName] = useState('');
  const [l_name, setLName] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/auth/signup',
    method: 'post',
    body: {
      email,
      password,
      f_name,
      l_name,
    },
    onSuccess: (response) =>
      Router.push(`/auth/verify?id=${response.id.toString()}`),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h3'>
          Create an Account
        </Typography>
        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <br />
          <TextField
            margin='normal'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label='Email'
            variant='outlined'
            required
            fullWidth
          />
          <br />
          <TextField
            margin='normal'
            value={f_name}
            onChange={(e) => setFName(e.target.value)}
            label='First Name'
            variant='outlined'
            required
            fullWidth
          />
          <br />
          <TextField
            margin='normal'
            value={l_name}
            onChange={(e) => setLName(e.target.value)}
            label='Last Name'
            variant='outlined'
            required
            fullWidth
          />
          <br />
          <TextField
            margin='normal'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label='Password'
            variant='outlined'
            type='password'
            required
            fullWidth
          />
          {errors}
          <br />
          <Button
            variant='outlined'
            sx={{ mt: 3, mb: 2 }}
            fullWidth
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent={'space-between'}>
            <Grid item xs>
              <Link href='/auth/signin' variant='body2'>
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
