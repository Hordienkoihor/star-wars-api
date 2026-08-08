import {
    BadRequestException,
    Body,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Param
} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

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
}
