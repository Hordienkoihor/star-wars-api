import {PeopleController} from "./people.controller";
import {Module} from "@nestjs/common";
import {PeopleService} from "./people.service";
import {peopleProviders} from "./people.providers";
import {DatabaseModule} from "../database/database.module";
import {HttpModule, HttpService} from "@nestjs/axios";

@Module({
    imports: [DatabaseModule, HttpModule],
    controllers: [PeopleController],
    providers: [PeopleService, ...peopleProviders],
    exports: [],
})
export class PeopleModule {}