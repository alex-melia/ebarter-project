import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import {
  TextField,
  Typography,
  Button,
  Link,
  Container,
  Toolbar,
  Box,
  Grid,
} from '@mui/material';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/auth/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/dashboard'),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div>
      <Toolbar />
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
            Sign In
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label='Password'
              variant='outlined'
              required
              type='password'
              fullWidth
            />
            <br />
            {errors}
            <Button
              variant='outlined'
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
              fullWidth
            >
              Sign In
            </Button>
            <Grid container justifyContent={'space-between'}>
              <Grid item xs>
                <Link href='/auth/forgot-password' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href='/auth/signup' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default SignIn;
