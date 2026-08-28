import {Test, TestingModule} from "@nestjs/testing";
import {FilesService} from "../files/files.service";
import {PlanetsController} from "./planets.controller";
import {PlanetsService} from "./planets.service";
import {CreatePlanetDto} from "./model/planet.dto";


describe('PlanetsController', () => {
    let controller: PlanetsController;
    let service: PlanetsService;

    const mockPlanetsService = {
        getAll: jest.fn().mockResolvedValue([{id: 1, name: 'Smth'}]),
        findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({id, name: 'Smth'})),
        add: jest.fn().mockImplementation((dto) => Promise.resolve({id: 1, ...dto})),
        get: jest.fn().mockImplementation((name: string) => Promise.resolve({id: 1, name: name})),
        getByName: jest.fn().mockImplementation((name: string) => Promise.resolve({id: 1, name: name})),
        getSinglePage: jest.fn().mockResolvedValue([{id: 1, name: 'Tatooine'}]),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PlanetsController],
            providers: [
                {provide: PlanetsService, useValue: mockPlanetsService,},
                {provide: FilesService, useValue: {}}
            ],

        }).compile();

        controller = module.get<PlanetsController>(PlanetsController);
        service = module.get<PlanetsService>(PlanetsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('should return an array of planet', async () => {
            const result = await controller.getAllPlanets()

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
        it('should return a passed person', async () => {
            const testPlanet: CreatePlanetDto = {
                climate: "",
                created: "",
                diameter: "",
                edited: "",
                films: [],
                gravity: "",
                imgs: [],
                name: "",
                orbital_period: "",
                population: "",
                rotation_period: "",
                surface_water: "",
                terrain: "",
                url: ""

            }

            const result = await controller.create(testPlanet, [])

            expect(result).toEqual({
                id: 1,
                ...testPlanet
            })
        })
    })
})
;
