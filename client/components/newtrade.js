import Router from 'next/router';
import { useState } from 'react';
import {
  Button,
  Typography,
  FormControl,
  TextField,
  Toolbar,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import useRequest from '../../hooks/use-request';

const NewTrade = ({ currentUser, items, receiver_items }) => {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/trades/new',
    method: 'post',
    body: {
      type,
      title,
      category,
      description,
      value,
    },
    onSuccess: () => Router.push('/summary/items'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    doRequest();
  };

  return currentUser && currentUser.verified ? (
    <FormControl onSubmit={handleSubmit}>
      <Toolbar />
      <Typography variant='h3'>Create an Item</Typography>
      <br></br>
      <br></br>
      <br />
      <FormControl>
        <InputLabel id='type-label'>I am offering...</InputLabel>
        <Select
          value={type}
          labelId='type-label'
          onChange={(e) => setType(e.target.value)}
          required
        >
          <MenuItem value={'product'}>Product</MenuItem>
          <MenuItem value={'service'}>Service</MenuItem>
        </Select>
      </FormControl>
      <br />
      <FormControl>
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label='Title'
          variant='outlined'
          required
        />
      </FormControl>
      <br />
      {type === 'product' ? (
        <FormControl>
          <Select
            value={category}
            label='Category'
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <MenuItem value={'none'}>None</MenuItem>
            <MenuItem value={'home & garden'}>Home & Garden</MenuItem>
            <MenuItem value={'automotive'}>Automotive</MenuItem>
            <MenuItem value={'fashion'}>Fashion</MenuItem>
            <MenuItem value={'electronics'}>Electronics</MenuItem>
            <MenuItem value={'collectables & art'}>Collectables & Art</MenuItem>
            <MenuItem value={'sports, hobbies & leisure'}>
              Sports, Hobbies & Leisure
            </MenuItem>
            <MenuItem value={'business supplies'}>Business Supplies</MenuItem>
            <MenuItem value={'health & beauty'}>Health & Beauty</MenuItem>
            <MenuItem value={'media'}>Media</MenuItem>
            <MenuItem value={'other'}>Other</MenuItem>
          </Select>
        </FormControl>
      ) : (
        <FormControl>
          <Select
            value={category}
            label='Category'
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <MenuItem value={'none'}>None</MenuItem>
            <MenuItem value={'it & technology'}>IT & Technology</MenuItem>
            <MenuItem value={'landscaping'}>Landscaping</MenuItem>
            <MenuItem value={'roofing'}>Roofing</MenuItem>
            <MenuItem value={'plumbing'}>Plumbing</MenuItem>
            <MenuItem value={'other'}>Other</MenuItem>
          </Select>
        </FormControl>
      )}
      <FormControl>
        <TextField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label='Description'
          variant='outlined'
          required
        />
      </FormControl>
      <br />
      <FormControl>
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          label='Estimated Value (£GBP)'
          variant='outlined'
          required
        />
      </FormControl>
      <br />
      {errors}
      <br />
      <Button variant='outlined' onClick={handleSubmit}>
        Create Item
      </Button>
    </FormControl>
  ) : (
    Router.push('/')
  );
};

export default NewTrade;
