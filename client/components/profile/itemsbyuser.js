import Router from 'next/router';
import {
	Grid,
	Card,
	CardMedia,
	CardContent,
	Typography,
	CardActionArea,
	Box,
	Toolbar,
	Divider,
} from '@mui/material';

const ItemsByUser = ({ currentUser, items }) => {
	const list = items
		.filter((item) => item.status !== 'traded')
		.map((item) => {
			return (
				<Grid item key={item.id} xs={12} sm={6} md={4}>
					<Card>
						<CardActionArea href={`/item/${item.id}`}>
							<CardContent>
								<Typography variant="h5" component="div">
									{item.title}
								</Typography>
								<Divider />
								<Typography variant="body2" color="text.primary">
									{item.category}
								</Typography>
								<CardMedia
									sx={{
										height: 256,
										width: 256,
										objectFit: 'contain',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
									image={item.itemPicture}
								/>
								<Divider />
								<Typography variant="body2" color="text.secondary">
									{item.description}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
			);
		});

	return currentUser && currentUser.verified ? (
		<Box>
			<Toolbar />
			<Grid container spacing={3}>
				{list}
			</Grid>
		</Box>
	) : (
		Router.push('/')
	);
};

export default ItemsByUser;
