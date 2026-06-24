import cloudinary from '../config/cloudinary';

export const uploadToCloudinary = (
    fileBuffer: Buffer,
    fileName: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: 'inuka/produtos',
                public_id: `${Date.now()}-${fileName}`,
                overwrite: true,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result?.secure_url || '');
                }
            }
        );

        stream.end(fileBuffer);
    });
};