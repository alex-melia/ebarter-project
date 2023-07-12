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
  Box,
} from '@mui/material';
import { CircularProgress } from '@mui/material';
import useRequest from '../../hooks/use-request';

const NewItem = ({ currentUser }) => {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [itemPicture, setItemPicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/items',
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

  const { doRequest: uploadImage, errors: uploadErrors } = useRequest({
    url: '/api/items/upload',
    method: 'post',
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
      setItemPicture({ file: value, name: file.name, type: file.type });
    }
  };

  const convertToFormData = (fileObject) => {
    const formData = new FormData();
    formData.append('file', fileObject.file);
    formData.append('name', fileObject.name);
    formData.append('type', fileObject.type);
    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = null;
    if (itemPicture) {
      try {
        console.log(itemPicture.file);
        const formData = convertToFormData(itemPicture.file);
        console.log(formData);
        const response = await uploadImage({
          file: formData,
          name: itemPicture.name,
          type: itemPicture.type,
        });
        if (response && response.data) {
          imageUrl = response.data.imageUrl;
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setUploading(false);
        return;
      }
    }

    doRequest({ imageUrl });
  };

  return currentUser && currentUser.verified ? (
    <Box component='main' sx={{ flexGrow: 1, p: 1 }}>
      <Toolbar />
      <FormControl onSubmit={handleSubmit}>
        <Toolbar />
        <Typography variant='h3'>Create an Item</Typography>
        <br></br>
        <br></br>
        <br />
        <FormControl>
          <input
            accept='image/*'
            style={{ display: 'none' }}
            id='contained-button-file'
            type='file'
            onChange={handleFileChange}
          />
          <label htmlFor='contained-button-file'>
            <Button variant='contained' component='span'>
              Upload Item Picture
            </Button>
          </label>
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
        <Button variant='outlined' onClick={handleSubmit} disabled={uploading}>
          {uploading ? <CircularProgress size={24} /> : 'Create Item'}
        </Button>
      </FormControl>
    </Box>
  ) : (
    Router.push('/')
  );
};

export default NewItem;
