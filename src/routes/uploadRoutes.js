const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../assets/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e5)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

// Upload API
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  return res.status(200).json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    url: `${process.env.PUBLIC_BACKEND_URL}/uploads/${req.file.filename}`,
  });
});

// Delete API
router.delete('/delete/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../assets/uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  });
});

module.exports = router;
