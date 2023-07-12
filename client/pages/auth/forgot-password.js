import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import {
  FormControl,
  TextField,
  Typography,
  Button,
  Container,
  Toolbar,
} from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/auth/forgot-password',
    method: 'post',
    body: {
      email,
    },
    onSuccess: () => setSuccessMsg('true'),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <Container maxWidth='sm'>
      <Toolbar />
      <Typography id='signup-text' variant='h3'>
        Forgot Password?
      </Typography>
      <div className='signup-form'>
        <FormControl onSubmit={handleSubmit}>
          <br />
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label='Email'
            variant='outlined'
            required
          />
          <br />
          <Button variant='outlined' onClick={handleSubmit}>
            Enter
          </Button>
        </FormControl>
        {successMsg === 'true' ? (
          <h1>Reset password token has been sent to your email</h1>
        ) : (
          errors
        )}
      </div>
    </Container>
  );
};

export default ForgotPassword;
