const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'y783bexd',
    api_key: '338761753996333',
    api_secret: 'rwYR0bWnAVdmDj-4XycDKm6s5C8' // yahi jo Render pe daal raha hai
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpg","jpeg"]
  },
});

module.exports = { cloudinary, storage };