import { useState } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';
import {
	FormControl,
	TextField,
	Typography,
	Button,
	Container,
	Toolbar,
} from '@mui/material';

const ResetPassword = () => {
	const router = useRouter();
	const token = router.query.token;

	const [password, setPassword] = useState('');

	const { doRequest, errors } = useRequest({
		url: '/api/auth/reset-password',
		method: 'post',
		body: {
			password,
			token,
		},
		onSuccess: () => router.push('/auth/signin'),
	});

	const handleSubmit = async (event) => {
		event.preventDefault();
		await doRequest();
	};

	return (
		<Container maxWidth="sm">
			<Toolbar />
			<Typography id="signup-text" variant="h3">
				Reset Password
			</Typography>
			<div className="signup-form">
				<FormControl onSubmit={handleSubmit}>
					<br />
					<TextField
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						label="Password"
						variant="outlined"
						required
					/>
					<br />
					{errors}
					<Button variant="outlined" onClick={handleSubmit}>
						Enter
					</Button>
				</FormControl>
			</div>
		</Container>
	);
};

export default ResetPassword;
