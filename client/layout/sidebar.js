import {
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  Divider,
  ListItemText,
  IconButton,
  Drawer as MuiDrawer,
} from '@mui/material';
import styled from '@emotion/styled';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Router from 'next/router';

const drawerWidth = 240;

const Sidebar = ({ currentUser, open, toggleDrawer }) => {
  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: open ? drawerWidth : 20,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }));

  const iconMapping = {
    Home: <HomeIcon />,
    'My Items': <ListIcon />,
    'My Trades': <SwapHorizIcon />,
    'My Chats': <ChatIcon />,
    'My Favourites': <FavoriteIcon />,
    'Sign Out': <LogoutIcon />,
  };

  iconMapping[`${currentUser.f_name} ${currentUser.l_name}`] = <PersonIcon />;

  const handleNavigation = (href) => {
    Router.push(href);
  };

  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser &&
      !currentUser.verified && {
        label: 'Sign In',
        href: '/auth/signin',
      },
    currentUser &&
      currentUser.role === 'user' && {
        label: 'Home',
        href: '/dashboard',
      },
    {
      label: 'My Items',
      href: '/summary/items',
    },
    {
      label: 'My Trades',
      href: '/summary/trades',
    },
    {
      label: 'My Chats',
      href: '/summary/chats',
    },
    {
      label: 'My Favourites',
      href: '/summary/favourites',
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }, index) => {
      const key = `${label}-${index}`;
      return (
        <ListItem key={key} disablePadding sx={{ mt: 5, mb: 5 }}>
          <ListItemButton
            sx={{ width: '100%' }}
            onClick={() => handleNavigation(href)}
          >
            <ListItemIcon sx={{ fontSize: '2rem' }}>
              {iconMapping[label]}
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        </ListItem>
      );
    });

  const profileLinks = [
    {
      label: `${currentUser.f_name} ${currentUser.l_name}`,
      href: `/summary/profile/${currentUser.id}`,
    },
    {
      label: 'Sign Out',
      href: '/auth/signout',
    },
  ].map(({ label, href }, index) => {
    const key = `${label}-${index}`;
    return (
      <ListItem key={key} disablePadding sx={{ mt: 5, mb: 5 }}>
        <ListItemButton
          sx={{ width: '100%' }}
          onClick={() => handleNavigation(href)}
        >
          <ListItemIcon sx={{ fontSize: '2rem' }}>
            {iconMapping[label]}
          </ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      </ListItem>
    );
  });

  const admin_links = [
    currentUser.role === 'admin' && {
      label: 'Home',
      href: '/dashboard',
    },
    {
      label: 'Manage Users',
      href: '/admin/users',
    },
    {
      label: 'Manage Items',
      href: '/admin/items',
    },
    <Divider key='divider' />,
    {
      label: `${currentUser.f_name} ${currentUser.l_name}`,
      href: '/profile/:id',
    },
    {
      label: 'Sign Out',
      href: '/auth/signout',
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }, index) => {
      const key = `${label}-${index}`;
      return (
        <ListItem key={key} disablePadding sx={{ mt: 5, mb: 5 }}>
          <ListItemButton
            sx={{ width: '100%' }}
            onClick={() => handleNavigation(href)}
          >
            <ListItemIcon sx={{ fontSize: '2rem' }}>
              {iconMapping[label]}
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        </ListItem>
      );
    });

  return (
    <Drawer
      variant='permanent'
      open={open}
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          boxSizing: 'border-box',
          position: 'relative',
          transition: 'width 0.3s',
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <List>
        {currentUser.role === 'user' ? (
          <>
            {links}
            <Divider />
            {profileLinks}
          </>
        ) : (
          admin_links
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
