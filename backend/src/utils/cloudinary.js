// Cloudinary configuration for image upload
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'perfume-ecommerce/products',
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`perfume-ecommerce/products/${publicId}`);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
