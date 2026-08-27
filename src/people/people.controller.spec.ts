import {PeopleController} from "./people.controller";
import {PeopleService} from "./people.service";
import {Test, TestingModule} from "@nestjs/testing";
import {CreatePeopleDto} from "./model/people.dto";
import {FilesService} from "../files/files.service";


describe('PeopleController', () => {
    let controller: PeopleController;
    let service: PeopleService;

    const mockPeopleService = {
        getAll: jest.fn().mockResolvedValue([{id: 1, title: 'Smth'}]),
        findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({id, title: 'Smth'})),
        add: jest.fn().mockImplementation((dto) => Promise.resolve({id: 1, ...dto})),
        search: jest.fn().mockImplementation((name: string) => Promise.resolve({id: 1, title: name})),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PeopleController],
            providers: [
                {provide: PeopleService, useValue: mockPeopleService,},
                { provide: FilesService, useValue: {} }
            ],

        }).compile();

        controller = module.get<PeopleController>(PeopleController);
        service = module.get<PeopleService>(PeopleService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('should return an array of people', async () => {
            const result = await controller.getAllPeople()

            expect(result).toEqual([{id: 1, title: 'Smth'}]);
            expect(service.getAll).toHaveBeenCalled()
        })
    })

    describe('findOne', () => {
        it('should return a people with specified id', async () => {
            const name = "Dovbush"

            const result = await controller.getForPage(name, '0', '0')

            expect(result).toEqual({id: 1, title: 'Dovbush'});
            expect(service.search).toHaveBeenCalled()
        })
    })

    describe('create', () => {
        it('should return a passed person', async () => {
            const testFilm: CreatePeopleDto = {
                birth_year: "",
                created: "",
                edited: "",
                eye_color: "",
                films: [],
                gender: "",
                hair_color: "",
                height: "",
                homeworld: 0,
                imgs: [],
                mass: "",
                name: "John",
                skin_color: "",
                species: [],
                starships: [],
                url: "",
                vehicles: []


            }

            const result = await controller.create(testFilm, [])

            expect(result).toEqual({
                id: 1,
                ...testFilm
            })
        })
    })
})
;
