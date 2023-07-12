import { CardActionArea, Card, Box, Stack, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const UserChatList = ({ currentUser, chats, onCardClick }) => {
	const list = chats
		.sort((a, b) => {
			const aLastMessageDate =
				a.messages.length > 0 ? a.messages[a.messages.length - 1].timestamp : 0;
			const bLastMessageDate =
				b.messages.length > 0 ? b.messages[b.messages.length - 1].timestamp : 0;

			return new Date(bLastMessageDate) - new Date(aLastMessageDate);
		})
		.map((chat) => {
			const isInitiator = chat.initiator.id === currentUser.id;
			const oppositeUser = isInitiator ? chat.receiver : chat.initiator;

			let lastActive = 'No messages yet';
			if (chat.messages.length > 0) {
				lastActive = formatDistanceToNow(
					new Date(chat.messages[chat.messages.length - 1].timestamp),
					{ addSuffix: true }
				);
			}

			return (
				<div key={chat.id}>
					<Card>
						<CardActionArea onClick={() => onCardClick(chat)}>
							<Box sx={{ p: 2, display: 'flex' }}>
								<Stack spacing={0.5}>
									<Typography variant="body2">
										{oppositeUser.f_name} {oppositeUser.l_name}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Last active: {lastActive}
									</Typography>
								</Stack>
							</Box>
						</CardActionArea>
					</Card>
				</div>
			);
		});

	return currentUser && currentUser.verified ? list : <h5>Not signed in</h5>;
};

export default UserChatList;
