import {Test, TestingModule} from '@nestjs/testing';
import {VehiclesService} from './vehicles.service';
import {HttpService} from "@nestjs/axios";
import {BadRequestException} from "@nestjs/common";
import {CreateVehicleDto} from "./model/vehicle.dto";

describe('VehiclesService', () => {
    let service: VehiclesService;

    const mockVehicleRepository = {
        find: jest.fn().mockResolvedValue([{id: 1, title: 'Inception'}]),
        findOne: jest.fn(),
        save: jest.fn().mockImplementation((planet) => Promise.resolve({id: planet.id || 1, ...planet})),
        create: jest.fn().mockImplementation((dto) => dto),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VehiclesService,
                {
                    provide: 'VEHICLES_REPOSITORY',
                    useValue: mockVehicleRepository
                }, {
                    provide: HttpService,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<VehiclesService>(VehiclesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all vehicles', async () => {
            const vehicles = await service.getAll();

            expect(vehicles).toEqual([{id: 1, title: 'Inception'}]);
        });
    });

    describe('create', () => {
        it('should save and return a vehicle', async () => {
            const vehicleName = "audi"
            const createDto: CreateVehicleDto = {
                cargo_capacity: "",
                consumables: "",
                cost_in_credits: "",
                created: "",
                crew: "",
                edited: "",
                films: [],
                imgs: [],
                length: "",
                manufacturer: "",
                max_atmosphering_speed: "",
                model: "",
                name: vehicleName,
                passengers: "",
                pilots: [],
                url: "",
                vehicle_class: ""

            };

            const newShip = await service.add(createDto);

            expect(newShip).toEqual(expect.objectContaining({id: 1, name: vehicleName}));
        });
    });

    describe('update', () => {
        it('should throw BadRequestException if passed no dto', async () => {
            await expect(service.update(1, null as any)).rejects.toThrow(BadRequestException);
        })

        it('should return a modified vehicle', async () => {
            const vehicleId = 1;
            const vehicleName = "spaceMercedes"

            const createDto: CreateVehicleDto = {
                cargo_capacity: "",
                consumables: "",
                cost_in_credits: "",
                created: "",
                crew: "",
                edited: "",
                films: [],
                imgs: [],
                length: "",
                manufacturer: "",
                max_atmosphering_speed: "",
                model: "",
                name: vehicleName,
                passengers: "",
                pilots: [],
                url: "",
                vehicle_class: ""

            };

            const result = await service.update(vehicleId, createDto);

            expect(mockVehicleRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({id: vehicleId, name: vehicleName})
            );

            expect(result).toEqual(
                expect.objectContaining({id: vehicleId, name: vehicleName})
            );
        })

    })

    describe('getByUrl', () => {
        it('should return vehicle by specified url', async () => {
            const url = "testUrl"
            const expectedVehicle = {id: 1, name: 'TestVehicleId'};

            mockVehicleRepository.findOne.mockResolvedValue(expectedVehicle);

            const vehicle = await service.getByUrl(url);

            expect(mockVehicleRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({where: {url: url}})
            );

            expect(vehicle).toEqual(expectedVehicle);
        })
    })

    describe('get', () => {
        it('should return vehicle by specified id', async () => {
            const vehicleId = 1;
            const expectedVehicle = {id: vehicleId, name: 'TestVehicleId'};

            mockVehicleRepository.findOne.mockResolvedValue(expectedVehicle);

            const vehicle = await service.get(vehicleId);

            expect(mockVehicleRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({where: {id: vehicleId}})
            );

            expect(vehicle).toEqual(expectedVehicle);
        })
    })

    describe('getByName', () => {
        it('should return vehicle by specified name', async () => {
            const vehicleName = "TestNameVehicle"
            const expectedVehicle = {id: 1, name: vehicleName};

            mockVehicleRepository.findOne.mockResolvedValue(expectedVehicle);

            const vehicle = await service.getByName(vehicleName);

            expect(mockVehicleRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({where: {name: vehicleName}})
            );

            expect(vehicle).toEqual(expectedVehicle);
        })
    })
});
