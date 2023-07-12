import Router from 'next/router';
import { useState } from 'react';
import {
  Button,
  Typography,
  FormControl,
  TextField,
  Toolbar,
  Box,
  Container,
} from '@mui/material';
import useRequest from '../../../hooks/use-request';
import useRequest2 from '../../../hooks/use-request2';

const UpdateUser = ({ currentUser, user }) => {
  const [f_name, setFName] = useState(user.f_name);
  const [l_name, setLName] = useState(user.l_name);
  const [bio, setBio] = useState(user.bio);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const { doRequest, errors } = useRequest({
    url: `/api/users/${user.id}`,
    method: 'put',
    body: {
      f_name,
      l_name,
      bio,
    },
    onSuccess: () => Router.push(`/summary/profile/${user.id}`),
  });

  const { doRequest2, errors2 } = useRequest2({
    url: '/api/users/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatar = document.getElementById('preview-avatar');
        avatar.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);
    const response = await doRequest2(formData);
    console.log(response.url);
    return response.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profilePicture !== user.profilePicture) {
      const imageUrl = await uploadImage();
      console.log(imageUrl);
      doRequest({ profilePicture: imageUrl });
    } else {
      doRequest({ profilePicture: profilePicture });
    }
  };

  return currentUser && currentUser.verified ? (
    <Container maxWidth='sm'>
      <Toolbar />
      <FormControl onSubmit={handleSubmit}>
        <Toolbar />
        <Typography variant='h3'>Update your profile</Typography>
        <br />
        <FormControl fullWidth>
          <input
            accept='image/*'
            style={{ display: 'none' }}
            id='contained-button-file'
            type='file'
            onChange={handleFileChange}
          />
          <Box display='flex' justifyContent='center'>
            <label htmlFor='contained-button-file'>
              <img
                id='preview-avatar'
                src={
                  user.profilePicture ||
                  'https://www.example.com/default-avatar.png'
                }
                alt='item picture'
                style={{
                  width: 256,
                  height: 256,
                  cursor: 'pointer',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </label>
          </Box>
        </FormControl>
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
        <FormControl>
          <TextField
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            label='Biography'
            variant='outlined'
            multiline
            rows={2}
            required
          />
        </FormControl>
        {errors}
        <br />
        <Button variant='outlined' onClick={handleSubmit}>
          Update User
        </Button>
      </FormControl>
    </Container>
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
