import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { config } from './index'; // Your main config file
import fs from 'fs'; // Needed if you clean up files from diskStorage

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export const uploadToCloudinary = (
  filePathOrBuffer: string | Buffer, // Can be file path or data URI from buffer
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePathOrBuffer as any, // filePathOrBuffer as any for buffer or path
      {
        folder: folder,
        resource_type: 'auto', // Automatically detect image, video, raw
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          // If filePathOrBuffer was a path from diskStorage, unlink it on error too if needed
          if (typeof filePathOrBuffer === 'string' && fs.existsSync(filePathOrBuffer)) {
             // fs.unlinkSync(filePathOrBuffer); // Decide if you want to remove on Cloudinary error
          }
          console.error('Cloudinary Upload Error:', error);
          reject(error);
        } else if (result) {
          // If filePathOrBuffer was a path from diskStorage, unlink it after successful upload
          if (typeof filePathOrBuffer === 'string' && fs.existsSync(filePathOrBuffer)) {
             fs.unlinkSync(filePathOrBuffer);
          }
          resolve(result);
        } else {
          reject(new Error('Cloudinary upload failed without error object.'));
        }
      },
    );
  });
};

// Optional: Function to delete an image from Cloudinary using its public_id or URL
export const deleteFromCloudinaryByUrl = async (imageUrl: string): Promise<void> => {
    try {
        // Extract public_id from URL. This depends on your Cloudinary URL structure.
        // Example: "http://res.cloudinary.com/demo/image/upload/v12345/folder/public_id.jpg"
        // A more robust regex might be needed. This is a simple example.
        const parts = imageUrl.split('/');
        const publicIdWithExtension = parts.slice(parts.indexOf('upload') + 2).join('/');
        const public_id = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));

        if (!public_id) {
            console.warn(`Could not extract public_id from URL: ${imageUrl}`);
            return;
        }
        await cloudinary.uploader.destroy(public_id);
        console.log(`Successfully deleted ${public_id} from Cloudinary.`);
    } catch (error) {
        console.error(`Failed to delete ${imageUrl} from Cloudinary:`, error);
    }
};

export default cloudinary;