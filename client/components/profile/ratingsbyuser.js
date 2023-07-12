import Router from 'next/router';
import { Card, Box, Toolbar, Typography, Rating } from '@mui/material';

const RatingsByUser = ({ currentUser, user }) => {
	const list = user.ratings.map((rating) => {
		return (
			<Card>
				<Rating value={rating.ratingValue} precision={1} readOnly />
				<Typography>{rating.ratingComment}</Typography>
			</Card>
		);
	});

	return currentUser && currentUser.verified ? (
		<Box>
			<Toolbar />
			{list}
		</Box>
	) : (
		Router.push('/')
	);
};

export default RatingsByUser;
