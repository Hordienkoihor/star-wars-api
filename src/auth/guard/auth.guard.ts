import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Observable} from "rxjs";
import {Request} from "express";
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../decorator/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService, private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (isPublic) {
            return true;
        }

       const request = context.switchToHttp().getRequest();
       const token = this.extractTokenFromRequest(request);

       if (!token) {
           throw new UnauthorizedException();
       }

       try {
           const payload = await this.jwtService.verifyAsync(token);

           request['user'] = payload;

       } catch (err) {
           throw new UnauthorizedException();
       }
       return true;
    }

    extractTokenFromRequest(request: Request): string | undefined {
        const [type, accessToken] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? accessToken : undefined;

    }


}