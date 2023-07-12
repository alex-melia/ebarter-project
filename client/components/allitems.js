import { CardActionArea, Typography, Pagination } from '@mui/material';
import Card from '@mui/material/Card';
import {
  Box,
  Divider,
  CardContent,
  CardMedia,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Grid,
  RadioGroup,
  Radio,
  FormControl,
  Avatar,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

const AllItems = ({ currentUser, items }) => {
  const [selectedCategories, setSelectedCategories] = useState({});
  const [showServices, setShowServices] = useState(false);
  const [showProducts, setShowProducts] = useState(true);
  const [valueRange, setValueRange] = useState([0, Infinity]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const productCategories = [
    'Home & Garden',
    'Automotive',
    'Fashion',
    'Electronics',
    'Collectables & Art',
    'Sports, Hobbies & Leisure',
    'Business Supplies',
    'Health & Beauty',
    'Media',
    'Other',
  ];

  const serviceCategories = [
    'Landscaping',
    'IT & Technology',
    'Roofing',
    'Plumbing',
    'Other',
  ];

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleTypeChange = (e) => {
    setShowServices(e.target.value === 'service');
    setShowProducts(e.target.value === 'product');
  };

  const handleCategoryChange = (e) => {
    setSelectedCategories({
      ...selectedCategories,
      [e.target.name]: e.target.checked,
    });
  };

  const handleServicesToggle = (e) => {
    setShowServices(e.target.checked);
  };

  const handleProductsToggle = (e) => {
    setShowProducts(e.target.checked);
  };

  const handleValueRangeChange = (event, newValue) => {
    setValueRange(newValue);
  };

  const activeItems = items.filter((item) => item.status !== 'traded');

  const getMaxValue = () => {
    const itemsToConsider = activeItems.filter((item) =>
      item.type === 'service' ? showServices : showProducts
    );
    return Math.max(...itemsToConsider.map((item) => item.value), 0);
  };

  const [maxValue, setMaxValue] = useState(getMaxValue());

  useEffect(() => {
    setMaxValue(getMaxValue());
  }, [showServices, showProducts]);

  const filteredItems = activeItems
    .filter((item) => {
      if (Object.values(selectedCategories).every((val) => !val)) return true;
      return selectedCategories[item.category];
    })
    .filter((item) => (item.type === 'service' ? showServices : showProducts))
    .filter(
      (item) => item.value >= valueRange[0] && item.value <= valueRange[1]
    )
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const itemsPerPage = 15;

  const list = filteredItems
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((item) => {
      return (
        <Grid item key={item.id} xs={12} sm={6} md={3}>
          <Card sx={{ display: 'flex' }}>
            <CardActionArea href={`/item/${item.id}`}>
              <CardMedia
                sx={{ height: 0, paddingTop: '56.63%', objectFit: 'contain' }}
                image={item.itemPicture}
              />
              <CardContent>
                <Box display='flex' alignItems='center'>
                  <Avatar src={item.user.profilePicture} />
                  <Typography variant='body2'>
                    {item.user.f_name} is offering...
                  </Typography>
                </Box>
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
          </Card>
        </Grid>
      );
    });

  return currentUser && currentUser.verified ? (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={3}>
        <div>
          <h4>I'm looking for a...</h4>
          <FormControl component='fieldset'>
            <RadioGroup
              row
              aria-label='type'
              name='type'
              value={showServices ? 'service' : 'product'}
              defaultValue='product'
              onChange={handleTypeChange}
            >
              <FormControlLabel
                value='service'
                control={<Radio />}
                label='Service'
              />
              <FormControlLabel
                value='product'
                control={<Radio />}
                label='Product'
              />
            </RadioGroup>
          </FormControl>
          <h4>Search</h4>
          <TextField
            label='Search'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <h4>Category</h4>
          <FormGroup>
            {(showServices ? serviceCategories : productCategories).map(
              (category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={selectedCategories[category] || false}
                      onChange={handleCategoryChange}
                      name={category}
                    />
                  }
                  label={category}
                />
              )
            )}
          </FormGroup>
          <h4>Estimated Value</h4>
          <Box width={200}>
            <Slider
              value={valueRange}
              onChange={handleValueRangeChange}
              valueLabelDisplay='auto'
              min={0}
              max={maxValue}
              step={1}
            />
          </Box>
        </div>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Grid container spacing={3}>
          {list}
        </Grid>
        <Box display='flex' justifyContent='center' marginTop={2}>
          <Pagination
            count={Math.ceil(filteredItems.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color='primary'
            size='large'
          />
        </Box>
      </Grid>
    </Grid>
  ) : (
    <div>
      <h1>Fail</h1>
    </div>
  );
};

export default AllItems;
