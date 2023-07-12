import { AppBar, Typography, Toolbar, MenuItem } from '@mui/material';

const Header = ({ currentUser }) => {
  const pages = [
    !currentUser && { label: 'About', href: '#about' },
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && {
      label: 'Sign Out',
      href: '/auth/signout',
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <MenuItem href={href} component='a'>
          {label}
        </MenuItem>
      );
    });

  const searchbar = <MenuItem>Search</MenuItem>;

  const logo = (
    <img
      src='/images/ebarter-logo-white-transparent.png'
      alt='E-Barter Logo'
      style={{ marginRight: '1rem', height: '40px' }}
    />
  );

  return (
    <AppBar
      position='fixed'
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        top: 0,
        left: 0,
      }}
    >
      <Toolbar>
        {currentUser ? (
          <MenuItem component='a' href='/dashboard'>
            {logo}
          </MenuItem>
        ) : (
          <MenuItem component='a' href='/'>
            <Typography variant='h6'>E-Barter</Typography>
          </MenuItem>
        )}
        {!currentUser ? pages : searchbar}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
