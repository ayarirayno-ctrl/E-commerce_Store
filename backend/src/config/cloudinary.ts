import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Validate required env vars for Cloudinary
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('Cloudinary environment variables are not fully set. Image uploads will fail until they are configured.');
}

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

// Use multer memory storage and provide helper to upload buffers to Cloudinary
const memoryStorage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage: memoryStorage,
  limits: { fileSize: parseInt(process.env.MAX_UPLOAD_SIZE || String(5 * 1024 * 1024), 10) }
});

// Helper to upload a Buffer (from multer memoryStorage) to Cloudinary
export const uploadBufferToCloudinary = (buffer: Buffer, filename?: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || 'ecommerce',
        public_id: filename ? filename.replace(/\.[^/.]+$/, '') : undefined,
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

// Fonction pour supprimer une image
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;