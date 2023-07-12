const express = require('express');
const multer = require('multer');
const multer_storage = multer.memoryStorage();
const upload = multer({ storage: multer_storage });

const { storage } = require('../gcloud-wrapper');
const bucket = storage.bucket('ebarter');

const router = express.Router();

router.post(
  '/api/items/upload',
  upload.single('itemPicture'),
  async (req, res) => {
    const itemPicture = req.file;
    console.log(itemPicture);

    if (itemPicture === undefined) {
      return res.status(200).send({ url: '' });
    } else {
      console.log('Form Data:', req.body);
      console.log('itemPicture:', itemPicture);

      const filename = `${Date.now()}-${itemPicture.originalname}`;
      const file = bucket.file(filename);

      const stream = file.createWriteStream({
        metadata: {
          contentType: itemPicture.mimetype,
        },
      });

      stream.on('error', (error) => {
        console.error('Error uploading file:', error);
        res.status(500).send({ error: 'Error uploading file' });
      });

      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        console.log('File uploaded to:', publicUrl);
        res.status(200).send({ url: publicUrl });
      });

      stream.end(itemPicture.buffer);
    }
  }
);

router.put(
  '/api/items/upload',
  upload.single('itemPicture'),
  async (req, res) => {
    res.status(200).send('hello');
  }
);

module.exports = router;
