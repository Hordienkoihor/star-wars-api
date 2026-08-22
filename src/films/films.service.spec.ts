import {Test, TestingModule} from '@nestjs/testing';
import {FilmsService} from './films.service';
import {Film} from "./model/film.entity";
import {CreateFilmDto} from "./model/film.dto";
import {HttpService} from "@nestjs/axios";
import {BadRequestException} from "@nestjs/common";

describe('FilmsService', () => {
    let service: FilmsService;

    const mockFilmRepository = {
        find: jest.fn().mockResolvedValue([{id: 1, title: 'Inception'}]),
        save: jest.fn().mockImplementation((film) => Promise.resolve({id: film.id || 2, ...film})),
        create: jest.fn().mockImplementation((dto) => dto),
        update: jest.fn().mockImplementation((film) => film),
        findOne: jest.fn(),
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

    describe('update', () => {
        it('should throw BadRequestException if passed no dto', async () => {
            await expect(service.update(1, null as any)).rejects.toThrow(BadRequestException);
        })

        it('should return a modified film', async () => {
            const filmId = 1;

            const createDto = {
                title: 'Matrix',
                characters: [10, 20]
            };

            const result = await service.update(filmId, createDto as CreateFilmDto);

            expect(mockFilmRepository.create).toHaveBeenCalledWith({
                id: filmId,
                title: 'Matrix',
                characters: [{id: 10}, {id: 20}],
                species: [],
                vehicles: [],
                planets: [],
                starships: [],
            });

            expect(mockFilmRepository.create).toHaveBeenCalled()

            expect(result).toEqual({
                id: filmId,
                title: 'Matrix',
                characters: [{ id: 10 }, { id: 20 }],
                species: [],
                planets: [],
                starships: [],
                vehicles: [],
            })
        })

    })

    describe('getByUrl', () => {
        it('should return film by specified url', async () => {
            const url = "testUrl"
            const expectedFilm = { id: 1, title: 'TestUrlFilm', url: url};

            mockFilmRepository.findOne.mockResolvedValue(expectedFilm);

            const film = await service.getByUrl(url);

            expect(mockFilmRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({ where: { url: url } })
            );

            expect(film).toEqual(expectedFilm);
        })
    })

    describe('get', () => {
        it('should return film by specified id', async () => {
            const filmId = 1;
            const expectedFilm = { id: filmId, title: 'TestIdFilm'};

            mockFilmRepository.findOne.mockResolvedValue(expectedFilm);

            const film = await service.get(filmId);

            expect(mockFilmRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: filmId } })
            );

            expect(film).toEqual(expectedFilm);
        })
    })

    describe('getByTitle', () => {
        it('should return film by specified Title', async () => {
            const filmTitle = "TestTitleFilm"
            const expectedFilm = { id: 1, title: filmTitle};

            mockFilmRepository.findOne.mockResolvedValue(expectedFilm);

            const film = await service.getByTitle(filmTitle);

            expect(mockFilmRepository.findOne).toHaveBeenCalledWith(
                expect.objectContaining({ where: { title: filmTitle } })
            );

            expect(film).toEqual(expectedFilm);
        })
    })
});
