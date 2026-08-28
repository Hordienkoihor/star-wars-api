import { Test, TestingModule } from '@nestjs/testing';
import { SpeciesController } from './species.controller';
import {SpeciesService} from "./species.service";
import {FilesService} from "../files/files.service";
import {CreatePlanetDto} from "../planets/model/planet.dto";
import {CreateSpeciesDto} from "./model/species.dto";

describe('SpeciesController', () => {
  let controller: SpeciesController;
  let service: SpeciesService;

  const mockSpeciesService = {
    getAll: jest.fn().mockResolvedValue([{id: 1, name: 'Smth'}]),
    findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({id, name: 'Smth'})),
    add: jest.fn().mockImplementation((dto) => Promise.resolve({id: 1, ...dto})),
    search: jest.fn().mockImplementation((name: string) => Promise.resolve({id: 1, name: name})),
    getByName: jest.fn().mockImplementation((name: string) => Promise.resolve({id: 1, name: name})),
    getSinglePage: jest.fn().mockResolvedValue([{id: 1, name: 'Tatooine'}]),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeciesController],
      providers: [
        {provide: SpeciesService, useValue: mockSpeciesService,},
        {provide: FilesService, useValue: {}}
      ],

    }).compile();

    controller = module.get<SpeciesController>(SpeciesController);
    service = module.get<SpeciesService>(SpeciesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of species', async () => {
      const result = await controller.getAllSpecies()

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
    it('should return a passed species', async () => {
      const testSpecies: CreateSpeciesDto = {
        average_height: "",
        average_lifespan: "",
        classification: "",
        created: "",
        edited: "",
        eye_colors: "",
        films: [],
        hair_colors: "",
        homeworld: 0,
        imgs: [],
        language: "",
        name: "",
        people: [],
        skin_colors: "",
        url: ""
      }

      const result = await controller.create(testSpecies, [])

      expect(result).toEqual({
        id: 1,
        ...testSpecies
      })
    })
  })
});
