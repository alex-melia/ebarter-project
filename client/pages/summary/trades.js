import {
  Box,
  CardContent,
  Toolbar,
  Card,
  Typography,
  CardActions,
  Button,
  CardActionArea,
  CardMedia,
  Divider,
  Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import NoDataTrades from '../../components/no-data/trades';

const Trades = ({ currentUser, trades }) => {
  const [tradeId, setTradeId] = useState('');
  const [status, setStatus] = useState('');

  const ongoingTrades = trades.filter(
    (trade) =>
      trade.status === 'accepted' ||
      trade.status === 'initiator-completed' ||
      trade.status === 'receiver-completed'
  );
  const completedTrades = trades.filter(
    (trade) => trade.status === 'rejected' || trade.status === 'completed'
  );
  const pendingTrades = trades.filter(
    (trade) =>
      trade.status === 'requested' && trade.initiator.id === currentUser.id
  );
  const offeredTrades = trades.filter(
    (trade) =>
      trade.status === 'requested' && trade.receiver.id === currentUser.id
  );

  const { doRequest, errors } = useRequest({
    url: `/api/trades/${tradeId}`,
    method: 'put',
    body: {
      status,
    },
    onSuccess: () => Router.push('/summary/trades'),
  });

  useEffect(() => {
    if (tradeId) {
      doRequest();
    }
  }, [tradeId]);

  const handleAccept = async (tradeId) => {
    setStatus('accepted');
    setTradeId(tradeId);
  };

  const handleDecline = async (tradeId) => {
    setStatus('rejected');
    setTradeId(tradeId);
  };

  const handleCompleted = async (tradeId, userType) => {
    if (userType === 'initiator') {
      setStatus('initiator-completed');
    } else if (userType === 'receiver') {
      setStatus('receiver-completed');
    }
    setTradeId(tradeId);
  };

  const getGridSize = () => {
    if (completedTrades.length >= 3) {
      return 4;
    } else {
      return 12 / completedTrades.length;
    }
  };

  return currentUser && currentUser.verified ? (
    <div>
      <Box component='main' sx={{ flexGrow: 1, p: 1 }}>
        {errors}
        <Toolbar />
        {trades.length === 0 ? (
          <NoDataTrades />
        ) : (
          <>
            {offeredTrades.length > 0 && (
              <h2 style={{ textAlign: 'center' }}>Offered Trades</h2>
            )}
            <br />
            {offeredTrades.map((trade) => (
              <div key={trade.id}>
                <Card>
                  <CardContent>
                    <Typography variant='h5' alignItems='center'>
                      You have{' '}
                      {trade.initiator.id === currentUser.id
                        ? `${trade.receiver.f_name} ${trade.receiver.l_name}`
                        : `been sent a request from ${trade.initiator.f_name} ${trade.initiator.l_name}`}
                    </Typography>
                    <Divider />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='h6' component='h5' align='center'>
                          Their item
                        </Typography>
                        <Card>
                          <CardActionArea
                            href={`/item/${trade.initiatorItem.id}`}
                          >
                            <CardMedia
                              sx={{
                                height: 0,
                                paddingTop: '40%',
                                objectFit: 'contain',
                              }}
                              image={trade.initiatorItem.itemPicture}
                            />
                            <CardContent>
                              <Typography variant='h6' component='div'>
                                {trade.initiatorItem.title}
                              </Typography>
                              <Divider />
                              <Typography variant='body2' color='text.primary'>
                                {trade.initiatorItem.category}
                              </Typography>
                              <Divider />
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                {trade.initiatorItem.description}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='h6' component='h5' align='center'>
                          Your item
                        </Typography>
                        <Card>
                          <CardActionArea
                            href={`/item/${trade.receiverItem.id}`}
                          >
                            <CardMedia
                              sx={{
                                height: 0,
                                paddingTop: '40%',
                                objectFit: 'contain',
                              }}
                              image={trade.receiverItem.itemPicture}
                            />
                            <CardContent>
                              <Typography variant='h6' component='div'>
                                {trade.receiverItem.title}
                              </Typography>
                              <Divider />
                              <Typography variant='body2' color='text.primary'>
                                {trade.receiverItem.category}
                              </Typography>
                              <Divider />
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                {trade.receiverItem.description}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => handleAccept(trade.id)}>
                      Accept Request
                    </Button>
                    <Button onClick={() => handleDecline(trade.id)}>
                      Decline Request
                    </Button>
                  </CardActions>
                </Card>
              </div>
            ))}
            <br />
            {ongoingTrades.length > 0 && (
              <h2 style={{ textAlign: 'center' }}>Ongoing Trades</h2>
            )}
            <br />
            {ongoingTrades.map((trade) => (
              <div key={trade.id}>
                <Card>
                  <CardContent>
                    <Typography variant='h5' alignItems='center'>
                      Your trade with{' '}
                      {trade.initiator.id === currentUser.id
                        ? `${trade.receiver.f_name} ${trade.receiver.l_name}`
                        : `${trade.initiator.f_name} ${trade.initiator.l_name}`}
                    </Typography>
                    <br />
                    <Divider />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='h6' component='h5' align='center'>
                          {trade.initiator.id === currentUser.id
                            ? 'Your Item'
                            : 'Their Item'}
                        </Typography>
                        <Card>
                          <CardMedia
                            sx={{
                              height: 0,
                              paddingTop: '40%',
                              objectFit: 'contain',
                            }}
                            image={trade.initiatorItem.itemPicture}
                          />
                          <CardContent>
                            <Typography variant='h6' component='div'>
                              {trade.initiatorItem.title}
                            </Typography>
                            <Divider />
                            <Typography variant='body2' color='text.primary'>
                              {trade.initiatorItem.category}
                            </Typography>
                            <Divider />
                            <Typography variant='body2' color='text.secondary'>
                              {trade.initiatorItem.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='h6' component='h5' align='center'>
                          {trade.receiver.id === currentUser.id
                            ? 'Your Item'
                            : 'Their Item'}
                        </Typography>
                        <Card>
                          <CardActionArea
                            href={`/item/${trade.receiverItem.id}`}
                          >
                            <CardMedia
                              sx={{
                                height: 0,
                                paddingTop: '40%',
                                objectFit: 'contain',
                              }}
                              image={trade.receiverItem.itemPicture}
                            />
                            <CardContent>
                              <Typography variant='h6' component='div'>
                                {trade.receiverItem.title}
                              </Typography>
                              <Divider />
                              <Typography variant='body2' color='text.primary'>
                                {trade.receiverItem.category}
                              </Typography>
                              <Divider />
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                {trade.receiverItem.description}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    {trade.initiator.id === currentUser.id &&
                    trade.status !== 'initiator-completed' ? (
                      <Button
                        onClick={() => handleCompleted(trade.id, 'initiator')}
                      >
                        Mark as Completed
                      </Button>
                    ) : (
                      trade.initiator.id === currentUser.id && (
                        <Typography variant='h6'>
                          Waiting for {trade.receiver.f_name}{' '}
                          {trade.receiver.l_name} to confirm
                        </Typography>
                      )
                    )}
                    {trade.receiver.id === currentUser.id &&
                    trade.status !== 'receiver-completed' ? (
                      <Button
                        onClick={() => handleCompleted(trade.id, 'receiver')}
                      >
                        Mark as Completed
                      </Button>
                    ) : (
                      trade.receiver.id === currentUser.id && (
                        <Typography variant='h6'>
                          Waiting for {trade.initiator.f_name}{' '}
                          {trade.initiator.l_name} to confirm
                        </Typography>
                      )
                    )}
                  </CardActions>
                </Card>
              </div>
            ))}
            <br />
            {completedTrades.length > 0 && (
              <h2 style={{ textAlign: 'center' }}>Completed Trades</h2>
            )}
            <br />
            <Grid container spacing={3}>
              {completedTrades.map((trade) => (
                <Grid item xs={12} sm={6} md={getGridSize()} key={trade.id}>
                  <Card>
                    <CardContent>
                      <Typography variant='h5' alignItems='center'>
                        Your trade with{' '}
                        {trade.initiator.id === currentUser.id
                          ? `${trade.receiver.f_name} ${trade.receiver.l_name}`
                          : `${trade.initiator.f_name} ${trade.initiator.l_name}`}
                      </Typography>
                      <br />
                      <Divider />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant='h6'
                            component='h5'
                            align='center'
                          >
                            {trade.initiator.id === currentUser.id
                              ? 'Your Item'
                              : 'Their Item'}
                          </Typography>
                          <Card>
                            <CardMedia
                              sx={{
                                height: 0,
                                paddingTop: '40%',
                                objectFit: 'contain',
                              }}
                              image={trade.initiatorItem.itemPicture}
                            />
                            <CardContent>
                              <Typography variant='h6' component='div'>
                                {trade.initiatorItem.title}
                              </Typography>
                              <Divider />
                              <Typography variant='body2' color='text.primary'>
                                {trade.initiatorItem.category}
                              </Typography>
                              <Divider />
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                {trade.initiatorItem.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant='h6'
                            component='h5'
                            align='center'
                          >
                            {trade.receiver.id === currentUser.id
                              ? 'Your Item'
                              : 'Their Item'}
                          </Typography>
                          <Card>
                            <CardMedia
                              sx={{
                                height: 0,
                                paddingTop: '40%',
                                objectFit: 'contain',
                              }}
                              image={trade.receiverItem.itemPicture}
                            />
                            <CardContent>
                              <Typography variant='h6' component='div'>
                                {trade.receiverItem.title}
                              </Typography>
                              <Divider />
                              <Typography variant='body2' color='text.primary'>
                                {trade.receiverItem.category}
                              </Typography>
                              <Divider />
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                {trade.receiverItem.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      {trade.initiator.id === currentUser.id &&
                      trade.initiatorSentReview === false ? (
                        <Button
                          href={`/summary/new-review?tradeId=${trade.id}`}
                        >
                          Send Review
                        </Button>
                      ) : (
                        <p></p>
                      )}
                      {trade.receiver.id === currentUser.id &&
                      trade.receiverSentReview === false ? (
                        <Button
                          href={`/summary/new-review?tradeId=${trade.id}`}
                        >
                          Send Review
                        </Button>
                      ) : (
                        <p></p>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <br />
            {pendingTrades.length > 0 && (
              <h2 style={{ textAlign: 'center' }}>Pending Trades</h2>
            )}
            <br />
            {pendingTrades.map((trade) => (
              <div key={trade.id}>
                <Card>
                  <CardContent>
                    <Typography variant='h5' alignItems='center'>
                      You have sent a request to {trade.receiver.f_name}{' '}
                      {trade.receiver.l_name}
                    </Typography>
                    <Divider />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='h6' component='h5' align='center'>
                          Your item
                        </Typography>
                        <Card>
                          <CardActionArea
                            href={`/item/${trade.initiatorItem.id}`}
                          >
                            <CardMedia
                              sx={{
                                height: 0,
                                paddingTop: '40%',
                                objectFit: 'contain',
                              }}
                              image={trade.initiatorItem.itemPicture}
                            />
                            <CardContent>
                              <Typography variant='h6' component='div'>
                                {trade.initiatorItem.title}
                              </Typography>
                              <Divider />
                              <Typography variant='body2' color='text.primary'>
                                {trade.initiatorItem.category}
                              </Typography>
                              <Divider />
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                {trade.initiatorItem.description}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant='h6' component='h5' align='center'>
                          Their item
                        </Typography>
                        <Card>
                          <CardActionArea
                            href={`/item/${trade.receiverItem.id}`}
                          >
                            <CardMedia
                              sx={{
                                height: 0,
                                paddingTop: '40%',
                                objectFit: 'contain',
                              }}
                              image={trade.receiverItem.itemPicture}
                            />
                            <CardContent>
                              <Typography variant='h6' component='div'>
                                {trade.receiverItem.title}
                              </Typography>
                              <Divider />
                              <Typography variant='body2' color='text.primary'>
                                {trade.receiverItem.category}
                              </Typography>
                              <Divider />
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                {trade.receiverItem.description}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div>
            ))}
          </>
        )}
      </Box>
    </div>
  ) : (
    <div>
      <h1>Not signed in</h1>
    </div>
  );
};

Trades.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get(`/api/trades/byuser/${currentUser.id}`);

  return { trades: data };
};

export default Trades;
