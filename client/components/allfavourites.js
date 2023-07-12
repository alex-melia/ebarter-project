import { CardActionArea, Typography, CardContent } from '@mui/material';
import Card from '@mui/material/Card';

const AllFavourites = ({ currentUser, items }) => {
  const list = items.map((item) => {
    return (
      <div key={item.id}>
        <Card sx={{ display: 'flex' }}>
          <CardActionArea href={`/item/${item.id}`}>
            <CardContent>
              <Typography variant='body2'>
                {item.user.f_name} is offering...
              </Typography>
              <Typography variant='h5' component='div'>
                {item.title}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {item.category}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );
  });

  return currentUser && currentUser.verified ? (
    list
  ) : (
    <div>
      <h1>Fail</h1>
    </div>
  );
};

export default AllFavourites;
