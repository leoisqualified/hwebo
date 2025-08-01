// utils/uploadToCloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          resolve(null); // fail gracefully
        } else {
          resolve(result?.secure_url || null);
        }
      }
    );
    stream.end(fileBuffer);
  });
};
