import Router from 'next/router';
import { useState } from 'react';
import {
  Button,
  Typography,
  Toolbar,
  Box,
  Container,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Divider,
  CardActions,
  Rating,
} from '@mui/material';

const User = ({ currentUser, user, userItems }) => {
  return currentUser && currentUser.verified ? (
    <Container>
      <Toolbar />
      <br />
      <Card>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CardMedia>
            <Avatar
              src={user.profilePicture}
              style={{ height: 180, width: 180 }}
            />
          </CardMedia>
          <Typography variant='h3'>
            {user.f_name} {user.l_name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating value={user.ratingAverage} precision={0.1} readOnly />
            <Typography component='h5' variant='body.secondary'>
              {'('}
              {user.ratingCount}
              {')'}
            </Typography>
          </Box>
          <br />
          <Typography component='h5' variant='body.secondary'>
            {user.bio}
          </Typography>
          <Divider />
        </CardContent>
        <CardActions sx={{ width: '100%', justifyContent: 'center' }}>
          <Button
            onClick={() =>
              Router.push(`/summary/update-profile/${currentUser.id}`)
            }
          >
            Update Profile
          </Button>
        </CardActions>
      </Card>
    </Container>
  ) : (
    Router.push('/')
  );
};

User.getInitialProps = async (context, client, currentUser) => {
  const { query } = context;
  const { data: user } = await client.get(`/api/users/${query.id}`);
  const { data: userItems } = await client.get(`/api/items/byuser/${query.id}`);

  return { user: user, userItems: userItems };
};

export default User;
