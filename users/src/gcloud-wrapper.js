const { Storage } = require('@google-cloud/storage');
const path = require('path');

const keyPath = path.join(__dirname, '..', 'ebarter-385621-502f4e72916f.json');

const storage = new Storage({
  keyFilename: keyPath,
  projectId: 'ebarter-385621',
});

module.exports = { storage };
