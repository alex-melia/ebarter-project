import Router from 'next/router';
import { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  FormControl,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import useRequest from '../../hooks/use-request';

const NewReview = ({ currentUser, trade }) => {
  const [userId, setUserId] = useState('');
  console.log(userId);
  console.log(trade);
  const [ratingValue, setRatingValue] = useState('');
  const [ratingComment, setRatingComment] = useState('');

  const { doRequest, errors } = useRequest({
    url: `/api/users/review/${userId}`,
    method: 'put',
    body: {
      ratingValue,
      ratingComment,
    },
    onSuccess: () => Router.push('/summary/trades'),
  });

  const { doRequest: doRequest2, errors: errors2 } = useRequest({
    url: `/api/trades/review/${trade.id}`,
    method: 'put',
    body: {
      userId: currentUser.id,
    },
    onSuccess: () => Router.push('/summary/trades'),
  });

  useEffect(() => {
    if (trade.initiator.id === currentUser.id && trade.initiatorSentReview) {
      Router.push('/dashboard');
    } else if (
      trade.receiver.id === currentUser.id &&
      trade.receiverSentReview
    ) {
      Router.push('/dashboard');
    }

    if (trade.initiator.id === currentUser.id) {
      setUserId(trade.receiver.id);
    } else if (trade.receiver.id === currentUser.id) {
      setUserId(trade.initiator.id);
    }
  }, [trade, currentUser]);

  console.log(userId);

  const handleSubmit = (e) => {
    e.preventDefault();

    doRequest();
    doRequest2();
  };

  return currentUser && currentUser.verified ? (
    <FormControl onSubmit={handleSubmit}>
      <Typography variant='h3'>Create an Review</Typography>
      <br></br>
      <br></br>
      <br />
      <FormControl>
        <InputLabel id='rating-val-label'>Value: </InputLabel>
        <Select
          value={ratingValue}
          labelId='rating-val-label'
          onChange={(e) => setRatingValue(e.target.value)}
          required
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <TextField
          value={ratingComment}
          onChange={(e) => setRatingComment(e.target.value)}
          label='Comment'
          variant='outlined'
          required
        />
      </FormControl>
      <br />
      {errors}
      {errors2}
      <br />
      <Button variant='outlined' onClick={handleSubmit}>
        Submit Review
      </Button>
    </FormControl>
  ) : (
    <div></div>
  );
};

NewReview.getInitialProps = async (context, client, currentUser) => {
  const { query } = context;
  const { data } = await client.get(`/api/trades/${query.tradeId}`);

  return { trade: data };
};

export default NewReview;
