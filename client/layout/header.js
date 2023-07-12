import {
	AppBar,
	Typography,
	Toolbar,
	MenuItem,
	IconButton,
} from '@mui/material';
import Image from 'next/image';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ currentUser, onMenuButtonClick }) => {
	const pages = [
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
				<MenuItem href={href} component="a">
					{label}
				</MenuItem>
			);
		});

	const searchbar = <MenuItem>Search</MenuItem>;

	const logo = (
		<Image
			src={'/images/ebarter-logo-white-transparent.png'}
			width={100}
			height={100}
			alt="E-Barter Logo"
			style={{ marginRight: '1rem', height: '40px' }}
		/>
	);

	return (
		<AppBar
			position="fixed"
			sx={{
				zIndex: (theme) => theme.zIndex.drawer + 1,
				top: 0,
				left: 0,
			}}
		>
			<Toolbar>
				<IconButton
					edge="start"
					color="inherit"
					aria-label="menu"
					onClick={onMenuButtonClick}
				>
					<MenuIcon />
				</IconButton>
				{currentUser ? (
					<MenuItem component="a" href="/dashboard">
						{logo}
					</MenuItem>
				) : (
					<MenuItem component="a" href="/">
						<Typography variant="h6">E-Barter</Typography>
					</MenuItem>
				)}
				{!currentUser ? pages : searchbar}
			</Toolbar>
		</AppBar>
	);
};

export default Header;
