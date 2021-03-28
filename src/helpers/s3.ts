import AWS, { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { PassThrough } from 'stream';

/**
 * S3 instance
 */
export const s3 = new AWS.S3({
  /**
   *
   */
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  /**
   *
   */
  secretAccessKey: process.env.AWS_SECRET_KEY_ACCESS,
  /**
   * Timeout 1 minute
   */
  httpOptions: { timeout: 60 * 60 * 1000 },
});

export const createUploadStream = (
  data: Omit<S3.Types.PutObjectRequest, 'Bucket' | 'Body'>,
  options?: ManagedUpload.ManagedUploadOptions,
) => {
  const pass = new PassThrough();
  return {
    writeStream: pass,
    promise: s3
      .upload(
        {
          Bucket: process.env.S3_AWS_BUCKET_NAME ?? '',
          ACL: 'public-read',
          CacheControl: 'max-age=31536000', // 365 days
          ...data,
          Body: pass,
        },
        options,
      )
      .promise(),
  };
};
