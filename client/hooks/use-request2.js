import axios from 'axios';
import { useState } from 'react';

const useRequest2 = ({ url, method, headers, body, onSuccess }) => {
	const [errors2, setErrors] = useState(null);

	const doRequest2 = async (props = {}) => {
		try {
			setErrors(null);
			const response = await axios({
				url,
				method,
				headers: { ...headers },
				data: props,
			});

			if (onSuccess) {
				onSuccess(response.data);
			}

			return response.data;
		} catch (err) {
			setErrors(
				<div className="alert alert-danger">
					<h4>Ooops....</h4>
					<ul className="my-0">
						{err.response.data.errors.map((err) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>
			);
		}
	};

	return { doRequest2, errors2 };
};

export default useRequest2;
