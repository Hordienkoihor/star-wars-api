import {Test, TestingModule} from '@nestjs/testing';
import {FilmsService} from './films.service';
import {Film} from "./model/film.entity";
import {CreateFilmDto} from "./model/film.dto";
import {HttpService} from "@nestjs/axios";

describe('FilmsService', () => {
    let service: FilmsService;

    const mockFilmRepository = {
        find: jest.fn().mockResolvedValue([{id: 1, title: 'Inception'}]),
        save: jest.fn().mockImplementation((film) => Promise.resolve({id: 2, ...film})),
        create: jest.fn().mockImplementation((dto) => dto),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FilmsService,
                {
                    provide: 'FILM_REPOSITORY',
                    useValue: mockFilmRepository,
                },
                {
                    provide: HttpService,
                    useValue: {}
                }
            ],
        }).compile();

        service = module.get<FilmsService>(FilmsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all films', async () => {
            const films = await service.getAll();

            expect(films).toEqual([{id: 1, title: 'Inception'}]);
        });
    });

    describe('create', () => {
        it('should save and return a film', async () => {
            const createDto = {title: 'Avatar'};
            const newFilm = await service.add(createDto as CreateFilmDto);

            expect(newFilm).toEqual({
                id: 2,
                title: 'Avatar',
                characters: [],
                planets: [],
                species: [],
                starships: [],
                vehicles: []
            });
        });
    });
});
