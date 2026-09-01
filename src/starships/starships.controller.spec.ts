import {Test, TestingModule} from '@nestjs/testing';
import {StarshipsController} from './starships.controller';
import {StarshipsService} from "./starships.service";
import {SpeciesController} from "../species/species.controller";
import {SpeciesService} from "../species/species.service";
import {FilesService} from "../files/files.service";
import {CreateSpeciesDto} from "../species/model/species.dto";
import {CreateStarShipDto} from "./model/starship.dto";

describe('StarshipsController', () => {
    let controller: StarshipsController;
    let service: StarshipsService;

    const mockStarshipService = {
        getAll: jest.fn().mockResolvedValue([{id: 1, name: 'Smth'}]),
        findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({id, name: 'Smth'})),
        add: jest.fn().mockImplementation((dto) => Promise.resolve({id: 1, ...dto})),
        search: jest.fn().mockImplementation((name: string) => Promise.resolve({id: 1, name: name})),
        getByName: jest.fn().mockImplementation((name: string) => Promise.resolve({id: 1, name: name})),
        getSinglePage: jest.fn().mockResolvedValue([{id: 1, name: 'Tatooine'}]),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StarshipsController],
            providers: [
                {provide: StarshipsService, useValue: mockStarshipService,},
                {provide: FilesService, useValue: {}}
            ],

        }).compile();

        controller = module.get<StarshipsController>(StarshipsController);
        service = module.get<StarshipsService>(StarshipsService);
    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('should return an array of starships', async () => {
            const result = await controller.getAllStarships()

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
        it('should return a passed starship', async () => {
            const testStarship: CreateStarShipDto = {
                cargo_capacity: "",
                consumables: "",
                cost_in_credits: "",
                created: "",
                crew: "",
                edited: "",
                films: [],
                hyperdrive_rating: "",
                imgs: [],
                length: "",
                manufacturer: "",
                max_atmosphering_speed: "",
                mglt: "",
                model: "",
                name: "raven",
                passengers: "",
                pilots: [],
                starship_class: "",
                url: ""

            }

            const result = await controller.create(testStarship, [])

            expect(result).toEqual({
                id: 1,
                ...testStarship
            })
        })
    })
});
