import {
    BadRequestException,
    Body,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Param
} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { Readable } from 'stream';

@Injectable()
export class FilesService {
    private readonly s3Client: S3Client;
    private readonly bucket: string;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.getOrThrow('AWS_S3_REGION'),
            credentials: {
                accessKeyId: configService.getOrThrow('AWS_S3_ACCESS_KEY'),
                secretAccessKey: configService.getOrThrow('AWS_S3_SECRET_ACCESS_KEY')
            }
        });

        this.bucket = configService.getOrThrow('AWS_S3_BUCKET_NAME');
    }

    async upload(filename: string, file: Buffer): Promise<string> {
        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: filename,
                    Body: file
                })
            )

            return filename;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }


    async remove(filename: string): Promise<boolean> {
        try {
            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: this.bucket,
                    Key: filename,
                })
            )

            return true;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }

    async getStream(filename: string): Promise<Readable> {
        try {
            const response = await this.s3Client.send(
                new GetObjectCommand({
                    Bucket: 'starwars-api-bucket-265315779869-eu-north-1-an',
                    Key: filename,
                })
            );
            return response.Body as Readable;
        } catch (e) {
            throw new NotFoundException('Image file is missing on S3');
        }
    }
}
