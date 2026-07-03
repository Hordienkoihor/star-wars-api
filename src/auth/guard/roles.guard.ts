import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Roles} from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get(Roles, context.getHandler)


        if (!requiredRoles) {
            return false;
        }

        const {user} = context.switchToHttp().getRequest();
        return requiredRoles.some(role => role === user.role);
    }
}