    import {Role} from "../../users/model/role.enum";
    import {SetMetadata} from "@nestjs/common";
    import {Reflector} from "@nestjs/core";

    export const Roles = Reflector.createDecorator<Role[]>()