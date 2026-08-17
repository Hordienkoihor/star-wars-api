import {Test, TestingModule} from '@nestjs/testing';
import {FilmsController} from './films.controller';
import {FilmsService} from "./films.service";
import {FilesService} from "../files/files.service";

describe('FilmsController', () => {
    let controller: FilmsController;
    let service: FilmsService;

    const mockFilmService = {
        getAll: jest.fn().mockResolvedValue([{id: 1, title: 'Smth'}]),
        findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({id, title: 'Smth'})),
        create: jest.fn().mockImplementation((dto) => Promise.resolve({id: Date.now(), ...dto})),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FilmsController],
            providers: [
                {provide: FilmsService, useValue: mockFilmService,},
                {provide: FilesService, useValue: {}},
            ],

        }).compile();

        controller = module.get<FilmsController>(FilmsController);
        service = module.get<FilmsService>(FilmsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('should return an array of films', async () => {
            const result = await controller.getAll()

            expect(result).toEqual([{id: 1, title: 'Smth'}]);
            expect(service.getAll).toHaveBeenCalled()
        })
    })
});
