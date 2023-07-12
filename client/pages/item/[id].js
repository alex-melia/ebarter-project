import Router from 'next/router';
import { useState, useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import {
  Button,
  Typography,
  Toolbar,
  Card,
  CardContent,
  CardActions,
  Box,
  Grid,
  Avatar,
  CardHeader,
  CardActionArea,
  Divider,
  CardMedia,
} from '@mui/material';

const Item = ({ currentUser, item, itemOwner, user }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const isCurrentUserOwner = currentUser.id === item.user.id;

  const { doRequest, errors } = useRequest({
    url: '/api/chats',
    method: 'post',
    body: {
      initiator: currentUser,
      receiver: itemOwner,
    },
    onSuccess: () => Router.push('/summary/chats'),
  });

  const { doRequest: doRequestFavourite, errors: errorsFavourite } = useRequest(
    {
      url: `/api/users/favourites/${currentUser.id}`,
      method: 'put',
      body: {
        item: item,
        type: isFavourite ? 'remove' : 'add',
      },
    }
  );

  useEffect(() => {
    if (currentUser && item && user.favourites) {
      setIsFavourite(
        user.favourites.some((favouriteItem) => favouriteItem.id === item.id)
      );
    } else {
      setIsFavourite(false);
    }
  }, [currentUser, item, user]);

  const handleChat = async () => {
    doRequest();
  };

  const handleFavourite = async () => {
    await doRequestFavourite();
    setIsFavourite(!isFavourite);
  };

  return currentUser && currentUser.verified ? (
    <Box component='main' sx={{ flexGrow: 1 }}>
      <Toolbar />
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{ maxWidth: '100%' }}>
            <CardHeader title={item.title} component='h1' />
            <Divider />
            <CardContent>
              <CardMedia
                component='img'
                sx={{
                  maxHeight: 350,
                  maxWidth: '100%',
                  objectFit: 'contain',
                  margin: 'auto',
                }}
                image={item.itemPicture}
              />
              <Typography variant='body1' color='text.primary'>
                {item.category}
              </Typography>
              <Typography variant='body1' color='text.primary'>
                Estimated Value: £{item.value}
              </Typography>
              <Divider />
              <Typography gutterBottom variant='h5' component='div'>
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title={'Item Owner'} variant='h5' />
            <CardActionArea href={`/profile/${itemOwner.id}`}>
              <Avatar
                src={item.user.profilePicture}
                sx={{ width: 64, height: 64, margin: 'auto', display: 'flex' }}
              />
              <Typography align='center' gutterBottom variant='h6'>
                {itemOwner.f_name} {itemOwner.l_name}
              </Typography>
            </CardActionArea>
            <CardActions>
              {!isCurrentUserOwner && (
                <Button
                  href={`/trades/request-trade?receiverId=${itemOwner.id}`}
                  size='small'
                >
                  Request Trade
                </Button>
              )}
              {!isCurrentUserOwner && (
                <Button onClick={handleChat} size='small'>
                  Contact {itemOwner.f_name}
                </Button>
              )}
              <Button onClick={handleFavourite} size='small'>
                {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  ) : (
    Router.push('/')
  );
};

Item.getInitialProps = async (context, client, currentUser) => {
  const { query } = context;
  const { data } = await client.get(`/api/items/${query.id}`);
  const { data: itemOwner } = await client.get(`/api/users/${data.user.id}`);
  const { data: user } = await client.get(`api/users/${currentUser.id}`);

  return { item: data, itemOwner, user };
};

export default Item;
