import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar Cloudinary con las credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Sube una imagen a Cloudinary
 * @param {String} filePath - Ruta del archivo temporal
 * @param {String} folder - Carpeta donde guardar la imagen en Cloudinary
 * @returns {Promise} - Promesa que resuelve con los datos de la imagen subida
 */
export const uploadImage = async (filePath, folder = 'workbuddy/productos') => {
  try {
    // Subir la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto'
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      original_filename: result.original_filename
    };
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    throw new Error('Error al subir la imagen');
  }
};

/**
 * Elimina una imagen de Cloudinary
 * @param {String} publicId - ID público de la imagen a eliminar
 * @returns {Promise} - Promesa que resuelve cuando se elimina la imagen
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error al eliminar la imagen de Cloudinary:', error);
    throw new Error('Error al eliminar la imagen');
  }
};

export default cloudinary;
