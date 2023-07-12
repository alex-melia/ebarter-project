const express = require('express');
const multer = require('multer');
const multer_storage = multer.memoryStorage();
const upload = multer({ storage: multer_storage });
const { storage } = require('../gcloud-wrapper');
const bucket = storage.bucket('ebarter');

const router = express.Router();

router.post(
  '/api/users/upload',
  upload.single('profilePicture'),
  async (req, res) => {
    const profilePicture = req.file;

    if (profilePicture === undefined) {
      return res.status(200).send({ url: '' });
    } else {
      const filename = `${Date.now()}-${profilePicture.originalname}`;
      const file = bucket.file(filename);

      const stream = file.createWriteStream({
        metadata: {
          contentType: profilePicture.mimetype,
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

      stream.end(profilePicture.buffer);
    }
  }
);

module.exports = router;
