import {
  Box,
  Toolbar,
  Typography,
  Grid,
  Link,
  Container,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import Router from 'next/router';

const LandingPage = ({ currentUser }) => {
  return currentUser && currentUser.verified ? (
    <Box component='main' sx={{ flexGrow: 1 }}>
      <Toolbar />
      <Typography component='h1'>
        <br />
        <br />
        <br />
        <br />
        <br />
        You are signed in {currentUser.email}, {currentUser.role}
      </Typography>
    </Box>
  ) : (
    <Box component='main' sx={{ flexGrow: 1 }}>
      <Box
        id='about'
        sx={{ minHeight: '100vh', paddingTop: 8, paddingBottom: 8 }}
      >
        <Container maxWidth='md'>
          <Typography variant='h2' align='center' gutterBottom>
            Welcome to E-Barter!
          </Typography>
          <Typography variant='h5' align='center' gutterBottom>
            The Neighbourhood Bartering Platform
          </Typography>
          <Typography variant='body1' align='center' paragraph>
            E-Barter is a unique online platform that brings the age-old
            practice of bartering into the 21st century. Our mission is to
            create a vibrant, community-driven marketplace where goods and
            services can be exchanged without the use of money.
          </Typography>
          <Typography variant='body1' align='center' paragraph>
            Are you looking to declutter your home and get rid of items you no
            longer need? Or maybe you have a skill or service you'd like to
            offer to your local community? E-Barter is the perfect place to
            start.
          </Typography>
          <Typography variant='body1' align='center' paragraph>
            Here's how it works:
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant='h6' align='center' gutterBottom>
                    Step 1: Sign Up
                  </Typography>
                  <Typography variant='body2'>
                    Create a free account to get started. You'll need to provide
                    some basic information about yourself and verify your
                    identity to ensure the safety and integrity of our
                    community.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant='h5' align='center' gutterBottom>
                    Step 2: List Your Items or Services
                  </Typography>
                  <Typography variant='body2'>
                    Use our easy listing tool to add the items or services you'd
                    like to barter. Be sure to include detailed descriptions and
                    high-quality photos to attract potential trade partners.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant='h6' align='center' gutterBottom>
                    Step 3: Start Trading!
                  </Typography>
                  <Typography variant='body2'>
                    Browse the listings and chat with other users to arrange
                    trades. Remember, the goal is to make trades that are
                    beneficial for both parties!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box align='center' marginTop={4}>
            <Button
              variant='contained'
              color='primary'
              component={Link}
              onClick={() => Router.push('./auth/signup')}
              to='/signup'
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

///
export default LandingPage;
