
import { SetMetadata } from '@nestjs/common';
import {Reflector} from "@nestjs/core";

export const Public = Reflector.createDecorator<boolean>()
