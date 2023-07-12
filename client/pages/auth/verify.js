import { useState } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';
import {
	FormControl,
	TextField,
	Typography,
	Button,
	Container,
} from '@mui/material';

const Verify = () => {
	const router = useRouter();
	const id = router.query.id;

	const [otp, setOtp] = useState('');

	const { doRequest, errors } = useRequest({
		url: '/api/auth/verify-otp',
		method: 'post',
		body: {
			user_id: id,
			otp,
		},
		onSuccess: () => router.push('/dashboard'),
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		await doRequest();
	};

	return (
		<Container maxWidth="sm">
			<br></br>
			<br></br>
			<Typography id="signup-text" variant="h3">
				Verify Account
			</Typography>
			<FormControl onSubmit={handleSubmit}>
				<br />
				<TextField
					value={otp}
					onChange={(e) => setOtp(e.target.value)}
					label="OTP"
					variant="outlined"
					required
				/>
				{errors}
				<br />
				<Button variant="outlined" onClick={handleSubmit}>
					Sign Up
				</Button>
			</FormControl>
		</Container>
	);
};

export default Verify;
