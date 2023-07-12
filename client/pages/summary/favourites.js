import { Box, Toolbar } from '@mui/material';
import AllFavourites from '../../components/allfavourites';
import NoDataFavourites from '../../components/no-data/favourites';

const Favourites = ({ currentUser, favourites }) => {
  console.log(favourites);
  return currentUser && currentUser.verified ? (
    <div>
      <Box component='main' sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        {favourites.length === 0 ? (
          <NoDataFavourites />
        ) : (
          <AllFavourites currentUser={currentUser} items={favourites} />
        )}
      </Box>
    </div>
  ) : (
    <div>
      <h1>Not signed in</h1>
    </div>
  );
};

Favourites.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get(`/api/users/${currentUser.id}`);

  return { favourites: data.favourites };
};

export default Favourites;
