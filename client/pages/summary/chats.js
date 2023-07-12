import {
  Box,
  Button,
  TextField,
  Toolbar,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import UserChatList from '../../components/userchatlist';
import useRequest from '../../hooks/use-request';
import NoDataChats from '../../components/no-data/chats';
import { formatDistanceToNow } from 'date-fns';

const Chats = ({ currentUser, initialChats }) => {
  const [displayedChat, setDisplayedChat] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState(initialChats);

  const messagesEndRef = useRef(null);

  const { doRequest, errors } = useRequest({
    url: currentChat ? `/api/chats/${currentChat.id}` : null,
    method: 'put',
    body: {
      sender: currentUser,
      message,
    },
    onSuccess: (updatedChat) => {
      setCurrentChat(updatedChat);
      setMessage('');
      setChats(
        chats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
      );
    },
  });

  useEffect(() => {
    if (chatId) {
      doRequest({ chatId });
    }
  }, [chatId, doRequest]);

  const handleCardClick = (chat) => {
    const isCurrentUserInitiator = chat.initiator.id === currentUser.id;
    const oppositeUser = isCurrentUserInitiator
      ? chat.receiver
      : chat.initiator;

    setDisplayedChat(`Chat with ${oppositeUser.f_name} ${oppositeUser.l_name}`);
    setCurrentChat(chat);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    doRequest({ chatId: currentChat.id });
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [currentChat]);

  return currentUser && currentUser.verified ? (
    <div>
      <Box component='main' sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        {chats.length === 0 ? (
          <NoDataChats />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={2}></Grid>
            <Grid item xs={2}>
              <Paper>
                <Typography variant='h6' gutterBottom>
                  Your Chats
                </Typography>
                <div style={{ maxHeight: '450px', overflowY: 'scroll' }}>
                  {' '}
                  {/* Added this */}
                  {chats && (
                    <UserChatList
                      currentUser={currentUser}
                      chats={chats}
                      onCardClick={handleCardClick}
                    />
                  )}
                </div>
              </Paper>
            </Grid>
            <Grid item xs={5}>
              <Paper>
                {displayedChat && (
                  <Typography variant='h6'>{displayedChat}</Typography>
                )}
                {currentChat && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '650px',
                    }}
                  >
                    <div style={{ overflowY: 'scroll' }}>
                      {currentChat.messages.map((msg, index) => {
                        const isCurrentUserSender =
                          msg.sender.id === currentUser.id;
                        return (
                          <Grid
                            container
                            justifyContent={
                              isCurrentUserSender ? 'flex-start' : 'flex-end'
                            }
                            key={index}
                          >
                            <Grid item>
                              <Paper
                                style={{
                                  margin: '5px',
                                  padding: '5px',
                                  backgroundColor: isCurrentUserSender
                                    ? 'green'
                                    : 'blue',
                                  color: 'white',
                                }}
                              >
                                <Typography variant='body1'>
                                  {isCurrentUserSender
                                    ? 'You'
                                    : msg.sender.f_name}
                                  : {msg.content}
                                </Typography>
                                <Typography variant='body2' color='white'>
                                  {formatDistanceToNow(
                                    new Date(msg.timestamp),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        );
                      })}
                      <div ref={messagesEndRef}></div>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <form onSubmit={handleSubmit}>
                        <TextField
                          label='Message'
                          value={message}
                          onChange={handleMessageChange}
                          fullWidth
                          margin='normal'
                          variant='outlined'
                        />
                        <Grid container justifyContent='center'>
                          <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                          >
                            Send
                          </Button>
                        </Grid>
                        <br />
                      </form>
                    </div>
                  </div>
                )}
              </Paper>
              <br />
              {errors}
            </Grid>
            <Grid item xs={2}>
              {' '}
            </Grid>
          </Grid>
        )}
      </Box>
    </div>
  ) : (
    <div>
      <h5>Not signed in</h5>
    </div>
  );
};

Chats.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get(`/api/chats/byuser/${currentUser.id}`);

  return { initialChats: data };
};

export default Chats;
