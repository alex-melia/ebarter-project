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
  Avatar,
  Box,
  Container,
} from '@mui/material';
import useRequest from '../../../hooks/use-request';
import useRequest2 from '../../../hooks/use-request2';

const UpdateItem = ({ currentUser, item }) => {
  const [type, setType] = useState(item.type);
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState(item.category);
  const [description, setDescription] = useState(item.description);
  const [value, setValue] = useState(item.value);
  const [itemPicture, setItemPicture] = useState(item.itemPicture);

  const { doRequest, errors } = useRequest({
    url: `/api/items/${item.id}`,
    method: 'put',
    body: {
      title,
      category,
      description,
      value,
    },
    onSuccess: () => Router.push('/summary/items'),
  });

  const { doRequest2, errors2 } = useRequest2({
    url: '/api/items/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setItemPicture(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatar = document.getElementById('preview-image');
        avatar.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append('itemPicture', itemPicture);
    const response = await doRequest2(formData);
    console.log(response.url);
    return response.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (itemPicture !== item.itemPicture) {
      const imageUrl = await uploadImage();
      console.log(imageUrl);
      doRequest({ itemPicture: imageUrl });
    } else {
      doRequest({ itemPicture: itemPicture });
    }
  };

  return currentUser && currentUser.verified ? (
    <Container maxWidth='sm'>
      <FormControl onSubmit={handleSubmit}>
        <Toolbar />
        <Typography variant='h3'>Update an Item</Typography>
        <br></br>
        <br />
        <FormControl fullWidth>
          <input
            accept='image/*'
            style={{ display: 'none' }}
            id='contained-button-file'
            type='file'
            onChange={handleFileChange}
          />
          <label htmlFor='contained-button-file'>
            <img
              id='preview-image'
              src={
                item.itemPicture || 'https://www.example.com/default-avatar.png'
              }
              alt='item picture'
              style={{
                width: 256,
                height: 256,
                cursor: 'pointer',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </label>
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
          <FormControl fullWidth>
            <InputLabel htmlFor='category'>Category</InputLabel>
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
              <MenuItem value={'collectables & art'}>
                Collectables & Art
              </MenuItem>
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
        <br />
        <FormControl fullWidth>
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label='Description'
            variant='outlined'
            multiline
            rows={4}
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
          Update Item
        </Button>
      </FormControl>
    </Container>
  ) : (
    Router.push('/')
  );
};

UpdateItem.getInitialProps = async (context, client, currentUser) => {
  const { query } = context;
  const { data } = await client.get(`/api/items/${query.id}`);

  return { item: data };
};

export default UpdateItem;
