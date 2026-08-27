import {Test, TestingModule} from '@nestjs/testing';
import {PeopleService} from './people.service';
import {HttpService} from '@nestjs/axios';
import {CreateFilmDto} from "../films/model/film.dto";
import {BadRequestException} from "@nestjs/common";
import {CreatePeopleDto} from "./model/people.dto";
import {People} from "./model/people.entity";
import {Planet} from "../planets/model/planet.entity";
import {Species} from "../species/model/species.entity";
import {Film} from "../films/model/film.entity";
import {Vehicle} from "../vehicles/model/vehicle.entity";
import {Starship} from "../starships/model/starship.entity";

describe('PeopleService', () => {
    let service: PeopleService;

    const mockPeopleRepository = {
        find: jest.fn().mockResolvedValue([{id: 1, title: 'Inception'}]),
        findOne: jest.fn(),
        save: jest.fn().mockImplementation((person) => Promise.resolve({id: person.id || 1, ...person})),
        create: jest.fn().mockImplementation((dto) => dto),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PeopleService,
                {
                    provide: 'PEOPLE_REPOSITORY',
                    useValue: mockPeopleRepository,
                },
                {
                    provide: HttpService,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<PeopleService>(PeopleService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all people', async () => {
            const films = await service.getAll();

            expect(films).toEqual([{id: 1, title: 'Inception'}]);
        });
    });

    describe('create', () => {
        it('should save and return a person', async () => {
            const createDto: CreatePeopleDto = {
                birth_year: "",
                created: "",
                edited: "",
                eye_color: "",
                gender: "",
                hair_color: "",
                height: "",
                homeworld: 0,
                imgs: [],
                mass: "",
                name: "John",
                skin_color: "",
                url: ""
            };

            const newPerson = await service.add(createDto as CreatePeopleDto);

            expect(newPerson).toEqual(expect.objectContaining({ id: 1, name: "John" }));
        });
    });

    describe('update', () => {
        it('should throw TypeError if passed no dto', async () => {
            await expect(service.update(1, null as any)).rejects.toThrow(TypeError);
        })

        it('should return a modified person', async () => {
            const personId = 1;

            const createDto: CreatePeopleDto = {
                birth_year: "",
                created: "",
                edited: "",
                eye_color: "",
                gender: "",
                hair_color: "",
                height: "",
                homeworld: 0,
                imgs: [],
                mass: "",
                name: "John",
                skin_color: "",
                url: ""
            };

            // mockPeopleRepository.create.mockReturnValue({
            //     id: personId, ...createDto, films: [],
            //     species: [],
            //     vehicles: [],
            //     starships: [],
            //     homeworld: 0
            // });
            const result = await service.update(personId, createDto as CreatePeopleDto);

            expect(mockPeopleRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({ id: personId, name: "John" })
            );

            expect(result).toEqual(
                expect.objectContaining({ id: personId, name: "John" })
            );
        })

    })

    describe('getByUrl', () => {
        it('should return person by specified url', async () => {
            const url = "testUrl"
            const expectedPerson = {id: 1, name: 'TestPersonId'};
            //     id: 1,
            //     birth_year: "",
            //     created: "",
            //     edited: "",
            //     eye_color: "",
            //     gender: "",
            //     hair_color: "",
            //     height: "",
            //     homeworld: {} as Planet,
            //     imgs: [],
            //     mass: "",
            //     name: "John",
            //     skin_color: "",
            //     url: url,
            //     species: [] as Species[],
            //     films: [] as Film[],
            //     vehicles: [] as Vehicle[],
            //     starships: [] as Starship[]
            // };


            mockPeopleRepository.findOne.mockResolvedValue(expectedPerson);

            const person = await service.getByUrl(url);

            expect(mockPeopleRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({where: {url: url}})
            );

            expect(person).toEqual(expectedPerson);
        })
    })

    describe('get', () => {
        it('should return person by specified id', async () => {
            const personId = 1;
            const expectedPerson = {id: personId, name: 'TestPersonId'};

            mockPeopleRepository.findOne.mockResolvedValue(expectedPerson);

            const person = await service.get(personId);

            expect(mockPeopleRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({where: {id: personId}})
            );

            expect(person).toEqual(expectedPerson);
        })
    })

    describe('getByTitle', () => {
        it('should return person by specified name', async () => {
            const personName = "TestNamePerson"
            const expectedPerson = {id: 1, name: personName};

            mockPeopleRepository.findOne.mockResolvedValue(expectedPerson);

            const person = await service.getByName(personName);

            expect(mockPeopleRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({where: {name: personName}})
            );

            expect(person).toEqual(expectedPerson);
        })
    })
});