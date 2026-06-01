import {PeopleController} from "./people.controller";
import {Module} from "@nestjs/common";
import {PeopleService} from "./people.service";
import {peopleProviders} from "./people.providers";
import {DatabaseModule} from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [PeopleController],
    providers: [PeopleService, ...peopleProviders],
    exports: [],
})
export class PeopleModule {}