import {
  Box,
  Button,
  Toolbar,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const RequestTrade = ({
  currentUser,
  items,
  receiver_items,
  receiverId,
  receiver,
}) => {
  const [initiatorItem, setInitiatorItem] = useState('');
  const [receiverItem, setReceiverItem] = useState('');

  const { id, f_name, l_name } = currentUser;
  const initiator = { id, f_name, l_name };

  const { doRequest, errors } = useRequest({
    url: '/api/trades',
    method: 'post',
    body: {
      initiator,
      receiver,
      initiatorItem,
      receiverItem,
    },
    onSuccess: () => Router.push('/summary/trades'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    doRequest();
  };

  return currentUser && currentUser.verified ? (
    <Box component='main' sx={{ flexGrow: 1, p: 1 }}>
      <Toolbar />
      <FormControl onSubmit={handleSubmit}>
        <Typography variant='h3'>Request a Trade</Typography>
        <br></br>
        <br></br>
        <br />
        <FormControl>
          <Select
            value={initiatorItem ? initiatorItem.id : ''}
            onChange={(e) =>
              setInitiatorItem(items.find((item) => item.id === e.target.value))
            }
            required
          >
            {items
              .filter((item) => item.status !== 'traded')
              .map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.title}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl>
          <Select
            value={receiverItem ? receiverItem.id : ''}
            onChange={(e) =>
              setReceiverItem(
                receiver_items.find((item) => item.id === e.target.value)
              )
            }
            required
          >
            {receiver_items
              .filter((item) => item.status !== 'traded')
              .map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.title}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Button variant='outlined' onClick={handleSubmit}>
          Request Trade
        </Button>
      </FormControl>
      {errors}
    </Box>
  ) : (
    <div>
      <h1>Not signed in</h1>
    </div>
  );
};

RequestTrade.getInitialProps = async (context, client, currentUser) => {
  const { query } = context;
  const { data } = await client.get(`/api/items/byuser/${currentUser.id}`);
  const { data: receiver_items } = await client.get(
    `/api/items/byuser/${query.receiverId}`
  );

  const receiverId = query.receiverId;
  const { data: receiverData } = await client.get(`/api/users/${receiverId}`);
  const { id, f_name, l_name } = receiverData;
  const receiver = { id, f_name, l_name };

  return { items: data, receiver_items, receiverId, receiver };
};

export default RequestTrade;
