import { S3Client } from '@aws-sdk/client-s3';

const bucketRegion = `${process.env.S3_BUCKET_REGION}`;
const bucketAccessKey = `${process.env.S3_BUCKET_ACCESS_KEY}`;
const bucketSecretKey = `${process.env.S3_BUCKET_SECRET_ACCESS_KEY}`;
export const bucketName = `${process.env.S3_BUCKET_NAME}`;

export const s3Client = new S3Client({
  credentials: {
    accessKeyId: bucketAccessKey,
    secretAccessKey: bucketSecretKey,
  },
  region: bucketRegion,
});
