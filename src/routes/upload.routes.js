const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadFile } = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth.middleware');

// Route to handle file upload
// We use the protect middleware if you only want authenticated users to upload files
// upload.single('file') expects a form-data field named 'file'
router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;
