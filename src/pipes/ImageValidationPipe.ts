import {BadRequestException, Inject, Injectable, PipeTransform} from "@nestjs/common";
import * as fs from "node:fs";

@Injectable()
export class ImageValidationPipe implements PipeTransform {
    async transform(files: Express.Multer.File[]): Promise<Express.Multer.File[]> {
        if (!files || !files.length) {
            throw new BadRequestException("file is missing");
        }

        const {fileTypeFromFile} = await import('file-type')

        const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];

        for (const file of files) {
            const signature = await fileTypeFromFile(file.path)

            if (!signature || !validTypes.includes(signature.mime)) {
                this.clean(files)
                throw new BadRequestException("Invalid signature");
            }
        }

        return files;
    }

    private clean(files: Express.Multer.File[]) {
        for (const file of files) {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }
    }
}