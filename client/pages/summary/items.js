import {
	Box,
	Button,
	Toolbar,
	Typography,
	Card,
	CardContent,
} from '@mui/material';
import ByUserList from '../../components/byuserlist';

const Items = ({ currentUser, items }) => {
	const activeItems = items.filter((item) => item.status === 'listed');
	const completedItems = items.filter((item) => item.status === 'traded');
	return currentUser && currentUser.verified ? (
		<div>
			<Box component="main" sx={{ flexGrow: 1, p: 1 }}>
				<Toolbar />
				<Button variant="contained" component="a" href="/summary/new-item">
					New Item
				</Button>
				{activeItems && (
					<ByUserList currentUser={currentUser} items={activeItems} />
				)}
				<h2>Traded Items</h2>
				{completedItems.map((item) => (
					<div key={item.id}>
						<Card>
							<CardContent>
								<Typography variant="h5">{item.title}</Typography>
							</CardContent>
						</Card>
					</div>
				))}
			</Box>
		</div>
	) : (
		<div>
			<h1>Not signed in</h1>
		</div>
	);
};

Items.getInitialProps = async (context, client, currentUser) => {
	const { data } = await client.get(`/api/items/byuser/${currentUser.id}`);

	return { items: data };
};

export default Items;
