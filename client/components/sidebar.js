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
import { useState } from 'react';

const drawerWidth = 240;

const Sidebar = ({ currentUser }) => {
  const [open, setOpen] = useState(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
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
    <Divider key='divider' />,
    {
      label: `${currentUser.f_name} ${currentUser.l_name}`,
      href: `/summary/profile/${currentUser.id}`,
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
        <ListItem key={key} disablePadding>
          <ListItemButton href={href}>
            <ListItemIcon></ListItemIcon>
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
        <ListItem key={key} disablePadding>
          <ListItemButton href={href}>
            <ListItemIcon></ListItemIcon>
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
        width: drawerWidth,
        flexShrink: 0,
        top: 64,
        left: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 64,
          left: 0,
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
      <List>{currentUser.role === 'user' ? links : admin_links}</List>
    </Drawer>
  );
};

export default Sidebar;
