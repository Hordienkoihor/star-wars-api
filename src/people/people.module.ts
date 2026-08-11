import {PeopleController} from "./people.controller";
import {Module} from "@nestjs/common";
import {PeopleService} from "./people.service";
import {peopleProviders} from "./people.providers";
import {DatabaseModule} from "../database/database.module";
import {HttpModule, HttpService} from "@nestjs/axios";
import {FilesModule} from "../files/files.module";

@Module({
    imports: [DatabaseModule, HttpModule, FilesModule],
    controllers: [PeopleController],
    providers: [PeopleService, ...peopleProviders],
    exports: [PeopleService],
})
export class PeopleModule {}