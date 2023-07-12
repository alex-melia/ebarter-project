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
  Container,
} from '@mui/material';
import useRequest from '../../hooks/use-request';
import useRequest2 from '../../hooks/use-request2';

const NewItem = ({ currentUser, userDetails }) => {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [itemPicture, setItemPicture] = useState(null);
  const [url, setUrl] = useState(null);

  const { doRequest, errors } = useRequest({
    url: '/api/items',
    method: 'post',
    body: {
      type,
      title,
      category,
      description,
      value,
      user: userDetails,
      itemPicture,
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

    setUrl(response.url);

    return response.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadImage();
    console.log('4');
    setUrl(imageUrl);

    console.log(imageUrl);

    doRequest({
      type,
      title,
      category,
      description,
      value,
      user: userDetails,
      itemPicture: imageUrl,
    });
  };

  return currentUser && currentUser.verified ? (
    <Container maxWidth='sm'>
      <Toolbar />
      <FormControl onSubmit={handleSubmit}>
        <Toolbar />
        <Typography variant='h3'>Create an Item</Typography>
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
              src={itemPicture}
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
          <Select
            value={type}
            label='type'
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
              <MenuItem value={'None'}>None</MenuItem>
              <MenuItem value={'Home & Garden'}>Home & Garden</MenuItem>
              <MenuItem value={'Automotive'}>Automotive</MenuItem>
              <MenuItem value={'Fashion'}>Fashion</MenuItem>
              <MenuItem value={'Electronics'}>Electronics</MenuItem>
              <MenuItem value={'Collectables & Art'}>
                Collectables & Art
              </MenuItem>
              <MenuItem value={'Sports, Hobbies & Leisure'}>
                Sports, Hobbies & Leisure
              </MenuItem>
              <MenuItem value={'Business Supplies'}>Business Supplies</MenuItem>
              <MenuItem value={'Health & Beauty'}>Health & Beauty</MenuItem>
              <MenuItem value={'Media'}>Media</MenuItem>
              <MenuItem value={'Other'}>Other</MenuItem>
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
              <MenuItem value={'None'}>None</MenuItem>
              <MenuItem value={'IT & Technology'}>IT & Technology</MenuItem>
              <MenuItem value={'Landscaping'}>Landscaping</MenuItem>
              <MenuItem value={'Roofing'}>Roofing</MenuItem>
              <MenuItem value={'Plumbing'}>Plumbing</MenuItem>
              <MenuItem value={'Other'}>Other</MenuItem>
            </Select>
          </FormControl>
        )}
        <br />
        <FormControl>
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
          Create Item
        </Button>
      </FormControl>
    </Container>
  ) : (
    Router.push('/')
  );
};

NewItem.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get(`/api/users/${currentUser.id}`);

  return { userDetails: data };
};

export default NewItem;
