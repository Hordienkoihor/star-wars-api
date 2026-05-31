import {PeopleController} from "./people.controller";
import {Module} from "@nestjs/common";
import {PeopleRepository} from "./people.repository";
import {PeopleService} from "./people.service";

@Module({
    imports: [],
    controllers: [PeopleController],
    providers: [PeopleService, PeopleRepository],
    exports: [],
})
export class PeopleModule {}