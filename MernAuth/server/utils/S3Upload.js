import dotenv from 'dotenv';
dotenv.config()

import axios from 'axios'

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";

const UploadS3 = async (url, title, idx) => {
    const s3BucketName = 'story-book-ai';
    const s3ObjectKey = `story-book-ai/Images/${title}/${idx}`;
    // Download image from URL
    axios.get(url, { responseType: 'arraybuffer' })
        .then(response => {
            const imageBuffer = Buffer.from(response.data);
            // Upload image to S3
            const s3 = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            });
            s3.upload({
                Bucket: s3BucketName,
                Key: s3ObjectKey,
                Body: imageBuffer
            }, (err, data) => {
                if (err) {
                    console.error(`Error uploading image to S3: ${err}`);
                }
            });
        })
        .catch(error => {
            console.error(`Failed to download image. Error: ${error.message}`);
        });
}

const S3Upload2 = async (url, title, idx) => {
    const s3BucketName = 'story-book-ai';
    const s3ObjectKey = `story-book-ai/Images/${title}/${idx}.jpg`;

    let imageBuffer = await axios.get(url, { responseType: 'arraybuffer' });
    imageBuffer = Buffer.from(imageBuffer.data);
    const client = new S3Client({credentials:fromEnv()});
    const command = new PutObjectCommand({
        Bucket: s3BucketName,
        Key: s3ObjectKey,
        Body: imageBuffer,
        ContentDisposition: "inline",
        ContentType: "image/jpeg",
        ACL: "public-read"
    });

    try {
        const response = await client.send(command);
        console.log(response);
    } catch (err) {
        console.error(err);
    }
};


export default S3Upload2
