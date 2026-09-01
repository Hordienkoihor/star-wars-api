import {Test, TestingModule} from '@nestjs/testing';
import {StarshipsService} from './starships.service';
import {HttpService} from "@nestjs/axios";
import {CreateSpeciesDto} from "../species/model/species.dto";
import {BadRequestException} from "@nestjs/common";
import {CreateStarShipDto} from "./model/starship.dto";

describe('StarshipsService', () => {
    let service: StarshipsService;

    const mockSpaceshipRepository = {
        find: jest.fn().mockResolvedValue([{id: 1, title: 'Inception'}]),
        findOne: jest.fn(),
        save: jest.fn().mockImplementation((planet) => Promise.resolve({id: planet.id || 1, ...planet})),
        create: jest.fn().mockImplementation((dto) => dto),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StarshipsService,
                {
                    provide: 'STARSHIP_REPOSITORY',
                    useValue: mockSpaceshipRepository,
                },
                {
                    provide: HttpService,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<StarshipsService>(StarshipsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all starships', async () => {
            const starships = await service.getAll();

            expect(starships).toEqual([{id: 1, title: 'Inception'}]);
        });
    });

    describe('create', () => {
        it('should save and return a starship', async () => {
            const starshipName = "linkor"
            const createDto: CreateStarShipDto = {
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
                name: starshipName,
                passengers: "",
                pilots: [],
                starship_class: "",
                url: ""
            };

            const newShip = await service.add(createDto);

            expect(newShip).toEqual(expect.objectContaining({id: 1, name: starshipName}));
        });
    });

    describe('update', () => {
        it('should throw BadRequestException if passed no dto', async () => {
            await expect(service.update(1, null as any)).rejects.toThrow(BadRequestException);
        })

        it('should return a modified starship', async () => {
            const shipId = 1;
            const starshipName = "Terra"

            const createDto: CreateStarShipDto = {
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
                name: starshipName,
                passengers: "",
                pilots: [],
                starship_class: "",
                url: ""


            };

            const result = await service.update(shipId, createDto);

            expect(mockSpaceshipRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({id: shipId, name: starshipName})
            );

            expect(result).toEqual(
                expect.objectContaining({id: shipId, name: starshipName})
            );
        })

    })

    describe('getByUrl', () => {
        it('should return spaceship by specified url', async () => {
            const url = "testUrl"
            const expectedplanet = {id: 1, name: 'TestplanetId'};

            mockSpaceshipRepository.findOne.mockResolvedValue(expectedplanet);

            const planet = await service.getByUrl(url);

            expect(mockSpaceshipRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({where: {url: url}})
            );

            expect(planet).toEqual(expectedplanet);
        })
    })

    describe('get', () => {
        it('should return starship by specified id', async () => {
            const starshipId = 1;
            const expectedStarship = {id: starshipId, name: 'TestStarshipId'};

            mockSpaceshipRepository.findOne.mockResolvedValue(expectedStarship);

            const starship = await service.get(starshipId);

            expect(mockSpaceshipRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({where: {id: starshipId}})
            );

            expect(starship).toEqual(expectedStarship);
        })
    })

    describe('getByName', () => {
        it('should return starship by specified name', async () => {
            const starshipName = "TestNameStarship"
            const expectedStarship = {id: 1, name: starshipName};

            mockSpaceshipRepository.findOne.mockResolvedValue(expectedStarship);

            const species = await service.getByName(starshipName);

            expect(mockSpaceshipRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({where: {name: starshipName}})
            );

            expect(species).toEqual(expectedStarship);
        })
    })
});
