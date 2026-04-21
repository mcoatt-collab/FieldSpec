import "server-only";

import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured() {
  if (configured) {
    return;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
}

export interface UploadBufferOptions {
  folder: string;
  publicId: string;
  format: string;
  resourceType?: "image" | "raw" | "video" | "auto";
}

export interface UploadedAsset {
  publicId: string;
  secureUrl: string;
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadBufferOptions,
): Promise<UploadedAsset> {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        format: options.format,
        overwrite: true,
        resource_type: options.resourceType ?? "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
        });
      },
    );

    uploadStream.end(buffer);
  });
}

export async function deleteCloudinaryAsset(publicId: string) {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
  });
}
