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

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.getOrThrow('AWS_S3_REGION')
        });
    }

    async upload(filename: string, file: Buffer): Promise<string> {
       try {
           await this.s3Client.send(
               new PutObjectCommand({
                   Bucket: 'starwars-api-bucket-265315779869-eu-north-1-an',
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
