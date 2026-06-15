import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ResponseInterceptor} from "./interceptor/response-interceptor";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new ResponseInterceptor());

    app.useGlobalPipes(new ValidationPipe({transform: true}));
    const swaggerConfig = new DocumentBuilder()
        .setTitle("Star Wars API")
        .setDescription("Star Wars information on any entity API")
        .setVersion("1.0")
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
