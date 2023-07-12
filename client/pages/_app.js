import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import buildClient from '../api/build-client';
import Head from 'next/head';
import Header from '../layout/header';
import Sidebar from '../layout/sidebar';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import theme from '../theme';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>E-Barter - The Online e-Trading System</title>
      </Head>
      <Box sx={{ display: 'flex' }}>
        <Header currentUser={currentUser} onMenuButtonClick={toggleDrawer} />
        {currentUser && (
          <Sidebar
            className='sidebar'
            currentUser={currentUser}
            open={drawerOpen}
            toggleDrawer={toggleDrawer}
          />
        )}
        <Box
          sx={{
            flexGrow: 1,
            transition: 'margin-left 0.3s',
          }}
        >
          <Component currentUser={currentUser} {...pageProps} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/auth/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
