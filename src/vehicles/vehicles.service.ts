import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {HttpService} from "@nestjs/axios";
import {CreateStarshipDto} from "../starships/model/starship.dto";
import {Vehicle} from "./model/vehicle.entity";
import {CreateVehicleDto} from "./model/vehicle.dto";

@Injectable()
export class VehiclesService {
    constructor(@Inject('VEHICLES_REPOSITORY') private readonly vehiclesRepository: Repository<Vehicle>, private readonly httpService: HttpService) {
    }

    async add(vehicleDto: CreateVehicleDto) {
        if (!vehicleDto) {
            throw new BadRequestException("empty vehicle dto");
        }

        const {pilots, films, ...vehicleData} = vehicleDto;

        const vehicle = this.vehiclesRepository.create({
            ...vehicleData,
            pilots: pilots ? pilots.map((id) => ({ id: Number(id)})) : [],
            films: films ? films.map((id) => ({ id: Number(id)})) : [],
        });
        return await this.vehiclesRepository.save(vehicle);
    }

    async get(id: number) {
        return await this.vehiclesRepository.findOne({
            where: {id},
            relations: {
                pilots: true,
                films: true,
            }
        })
    }

    async getAll() {
        return await this.vehiclesRepository.find();
    }

    async getSinglePage(offset: number = 0, limit: number = 10) {
        return await this.vehiclesRepository.find({
            skip: offset,
            take: limit,
            relations: {
                pilots: true,
                films: true,
            }
        })
    }

    async update(id: number, vehicleDto: CreateVehicleDto) {
        if (!vehicleDto) {
            throw new BadRequestException("empty vehicle dto");
        }


        const {pilots, films, ...vehicleData} = vehicleDto;

        const vehicle = this.vehiclesRepository.create({
            id: id,
            ...vehicleData,
            pilots: pilots ? pilots.map((id) => ({ id: Number(id)})) : [],
            films: films ? films.map((id) => ({ id: Number(id)})) : [],
        });


        return await this.vehiclesRepository.save(vehicle);
    }

    async delete(id: number) {
        return await this.vehiclesRepository.delete(id);
    }
}
