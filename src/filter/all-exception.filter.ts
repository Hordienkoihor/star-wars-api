import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from "@nestjs/common";
import {HttpAdapterHost} from "@nestjs/core";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    }

    catch(exception: unknown, host: ArgumentsHost): void {
        const {httpAdapter} = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        let message: string | object = 'Internal server error';

        if (exception instanceof HttpException) {
            const responseBody = exception.getResponse();
            message = typeof responseBody === 'object' && responseBody['message']
                ? responseBody['message']
                : responseBody;
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        const body = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            errors: Array.isArray(message) ? message : [message]
        }

        httpAdapter.reply(ctx.getResponse(), body, status)
    }

}