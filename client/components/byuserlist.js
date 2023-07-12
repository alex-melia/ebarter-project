import { CardActionArea, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Router from 'next/router';
import useRequest from '../hooks/use-request';
import {
  Divider,
  Button,
  Grid,
  CardMedia,
  CardActions,
  CardContent,
} from '@mui/material';
import { useEffect, useState } from 'react';

const ByUserList = ({ currentUser, items }) => {
  const [itemId, setItemId] = useState('');

  const { doRequest, errors } = useRequest({
    url: `/api/items/${itemId}`,
    method: 'delete',
    onSuccess: () => Router.push('/summary/items'),
  });

  useEffect(() => {
    if (itemId) {
      doRequest();
    }
  }, [itemId]);

  const handleDelete = async (itemId) => {
    setItemId(itemId);
  };

  const list = items.map((item) => {
    return (
      <Grid item key={item.id} xs={12} sm={6} md={4}>
        <Card sx={{ display: 'flex' }}>
          <CardActionArea href={`/item/${item.id}`}>
            <CardMedia
              sx={{ height: 0, paddingTop: '56.63%', objectFit: 'contain' }}
              image={item.itemPicture}
            />
            <CardContent>
              <Typography variant='h5' component='div'>
                {item.title}
              </Typography>
              <Divider />
              <Typography variant='body2' color='text.primary'>
                {item.category}
              </Typography>
              <Divider />
              <Typography variant='body2' color='text.secondary'>
                {item.description}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button onClick={() => handleDelete(item.id)}>Unlist Item</Button>
            <Button href={`/summary/update-item/${item.id}`}>
              Update Item
            </Button>
          </CardActions>
        </Card>
        {errors}
      </Grid>
    );
  });

  return currentUser && currentUser.verified ? (
    <Grid container spacing={2}>
      {list}
    </Grid>
  ) : (
    Router.push('/')
  );
};

export default ByUserList;
