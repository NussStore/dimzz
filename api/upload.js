
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: '/tmp' });

module.exports = (req, res) => {
  upload.single('image')(req, res, async function (err) {
    if (err || !req.file) {
      return res.status(400).json({ error: 'Gagal upload gambar.' });
    }

    try {
      const form = new FormData();
      form.append('content_type', '1');
      form.append('file', fs.createReadStream(req.file.path), req.file.originalname);

      const response = await axios.post('https://pixhost.to/uploads', form, {
        headers: form.getHeaders(),
      });

      const imagePage = response.data.match(/https:\/\/pixhost\.to\/show\/[^"]+/);
      if (imagePage && imagePage[0]) {
        return res.json({ url: imagePage[0] });
      } else {
        return res.status(500).json({ error: 'Gagal mendapatkan URL gambar.' });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
};
    
