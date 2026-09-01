import {Test, TestingModule} from '@nestjs/testing';
import {VehiclesController} from './vehicles.controller';
import {VehiclesService} from "./vehicles.service";
import {FilesService} from "../files/files.service";
import {CreateVehicleDto} from "./model/vehicle.dto";

describe('VehiclesController', () => {
    let controller: VehiclesController;
    let service: VehiclesService;

    const mockVehicleService = {
        getAll: jest.fn().mockResolvedValue([{id: 1, name: 'Smth'}]),
        findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({id, name: 'Smth'})),
        add: jest.fn().mockImplementation((dto) => Promise.resolve({id: 1, ...dto})),
        search: jest.fn().mockImplementation((name: string) => Promise.resolve({id: 1, name: name})),
        getByName: jest.fn().mockImplementation((name: string) => Promise.resolve({id: 1, name: name})),
        getSinglePage: jest.fn().mockResolvedValue([{id: 1, name: 'Tatooine'}]),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VehiclesController],
            providers: [
                {provide: VehiclesService, useValue: mockVehicleService,},
                {provide: FilesService, useValue: {}}
            ],
        }).compile();

        controller = module.get<VehiclesController>(VehiclesController);
        service = module.get<VehiclesService>(VehiclesService)
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('should return an array of vehicles', async () => {
            const result = await controller.getAllVehicles()

            expect(result).toEqual([{id: 1, name: 'Smth'}]);
            expect(service.getAll).toHaveBeenCalled()
        })
    })

    describe('getForPage', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should call getByName if name is provided", async () => {
            const name = "Dovbush"
            const result = await controller.getForPage(name, 10, 5);
            expect(result).toEqual({id: 1, name: 'Dovbush'});
            expect(service.getSinglePage).not.toHaveBeenCalled();
        })

        it( "should call getSinglePage with params if no name was provided", async () => {
            const result = await controller.getForPage(undefined, 10, 5);

            expect(service.getSinglePage).toHaveBeenCalledWith(10, 5);
            expect(service.getByName).not.toHaveBeenCalled();
        });

        it('should getSinglePage without params if nothing was provided', async () => {
            const result = await controller.getForPage(undefined, undefined, undefined);

            expect(service.getSinglePage).toHaveBeenCalledWith();
        });

    })

    describe('create', () => {
        it('should return a passed vehicle', async () => {
            const vehicleName = "audi"
            const testVehicle: CreateVehicleDto = {
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


            }

            const result = await controller.create(testVehicle, [])

            expect(result).toEqual({
                id: 1,
                ...testVehicle
            })
        })
    })
});
