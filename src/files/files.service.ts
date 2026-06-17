import {BadRequestException, Body, Injectable, NotFoundException, Param} from '@nestjs/common';
import fsPromise from "fs/promises";
import Path from "node:path";
import {existsSync} from "fs";

@Injectable()
export class FilesService {
    private readonly baseImagePath = './uploads'

    async removeImages(@Body() images: string[]) {
        await Promise.all(images.map(async (image) => {
                try {
                    if (existsSync(image)) {
                        await fsPromise.unlink(Path.join(this.baseImagePath, image));
                    }
                } catch (e) {
                    console.error(e)
                }
            })
        )
    }

}
