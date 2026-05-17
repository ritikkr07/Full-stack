const cloudinary = require('../config/cloudinary');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    // Determine resource type
    const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

    // Upload to Cloudinary using a stream since we use memory storage
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: 'uploads', // Optional: customize the folder name
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        // Pipe the buffer to the stream
        const intoStream = require('stream').Readable.from(req.file.buffer);
        intoStream.pipe(stream);
      });
    };

    const result = await streamUpload(req);
    console.log('Uploaded to Cloudinary:', result.secure_url);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
        format: result.format,
      },
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during upload', error: error.message });
  }
};

module.exports = {
  uploadFile,
};
