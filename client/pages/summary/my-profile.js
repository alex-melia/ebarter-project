import Router from 'next/router';
import {
  Button,
  Typography,
  Toolbar,
  Avatar,
  Container,
  Card,
} from '@mui/material';

const Profile = ({ currentUser, user }) => {
  return currentUser && currentUser.verified ? (
    <Container maxWidth='sm'>
      <Toolbar />
      <Button href={`/summary/update-profile/${user.id}`}>
        Update Profile
      </Button>
      <Card>
        <Avatar
          src={
            user.profilePicture || 'https://www.example.com/default-avatar.png'
          }
          alt='profile picture'
          style={{ width: 128, height: 128 }}
        />
        <Typography variant='h3'>
          {user.f_name} {user.l_name}
        </Typography>
        <Typography variant='h3'>{user.ratingAverage}</Typography>
      </Card>
    </Container>
  ) : (
    Router.push('/')
  );
};

Profile.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get(`/api/users/${currentUser.id}`);

  return { user: data };
};

export default Profile;
