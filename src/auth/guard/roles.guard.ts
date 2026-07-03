import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {ROLES_KEY} from "../decorator/roles.decorator";
import {Role} from "../../users/model/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        )


        if (!requiredRoles) {
            return false;
        }

        const {user} = context.switchToHttp().getRequest();
        return requiredRoles.some(role => role === user.role);
    }
}