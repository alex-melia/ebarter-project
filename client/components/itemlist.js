import { CardActionArea, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Router from 'next/router';
import useRequest from '../hooks/use-request';
import {
  Box,
  Stack,
  Divider,
  Button,
  Grid,
  TextField,
  CardMedia,
} from '@mui/material';
import { useEffect, useState } from 'react';

const ItemList = ({ currentUser, items }) => {
  const [itemId, setItemId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { doRequest, errors } = useRequest({
    url: `/api/items/${itemId}`,
    method: 'delete',
    onSuccess: () => Router.push('/admin/items'),
  });

  useEffect(() => {
    if (itemId) {
      doRequest();
    }
  }, [itemId]);

  const handleDelete = async (itemId) => {
    setItemId(itemId);
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const list = filteredItems.map((item) => {
    return (
      <Grid item key={item.id} xs={12} sm={6} md={4}>
        <Card>
          <CardActionArea href={`/item/${item.id}`}>
            <CardMedia
              sx={{ height: 0, paddingTop: '56.63%', objectFit: 'contain' }}
              image={item.itemPicture}
            />
            <Box sx={{ p: 2, display: 'flex' }}>
              <Stack spacing={0.5} sx={{ marginLeft: 2 }}>
                <Typography variant='h6' component='div'>
                  {item.title}
                </Typography>
                <Typography variant='h6' component='div'>
                  {item.category}
                </Typography>
                <Typography variant='h6' component='div'>
                  {item.description}
                </Typography>
              </Stack>
              <Divider />
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                sx={{ px: 2, py: 1, bgcolor: 'background.default' }}
              ></Stack>
            </Box>
          </CardActionArea>
          <Button onClick={() => handleDelete(item.id)}>Delete Item</Button>
        </Card>
        {errors}
      </Grid>
    );
  });

  return currentUser && currentUser.role === 'admin' ? (
    <div>
      <TextField
        label='Search for an item'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={3}>
        {list}
      </Grid>
    </div>
  ) : (
    <div>
      <h1>Fail</h1>
      <p>{currentUser}</p>
    </div>
  );
};

export default ItemList;
