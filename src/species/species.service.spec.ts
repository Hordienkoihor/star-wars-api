import { Test, TestingModule } from '@nestjs/testing';
import { SpeciesService } from './species.service';
import {PlanetsService} from "../planets/planets.service";
import {HttpService} from "@nestjs/axios";
import {CreatePlanetDto} from "../planets/model/planet.dto";
import {BadRequestException} from "@nestjs/common";
import {Like} from "typeorm";
import {CreateSpeciesDto} from "./model/species.dto";

describe('SpeciesService', () => {
  let service: SpeciesService;

  const mockSpeciesRepository = {
    find: jest.fn().mockResolvedValue([{id: 1, title: 'Inception'}]),
    findOne: jest.fn(),
    save: jest.fn().mockImplementation((planet) => Promise.resolve({id: planet.id || 1, ...planet})),
    create: jest.fn().mockImplementation((dto) => dto),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeciesService,
        {
          provide: 'SPECIES_REPOSITORY',
          useValue: mockSpeciesRepository,
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SpeciesService>(SpeciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all species', async () => {
      const species = await service.getAll();

      expect(species).toEqual([{id: 1, title: 'Inception'}]);
    });
  });

  describe('create', () => {
    it('should save and return a species', async () => {
      const createDto: CreateSpeciesDto = {
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
        name: "Terra",
        people: [],
        skin_colors: "",
        url: ""

      };

      const newPlanet = await service.add(createDto);

      expect(newPlanet).toEqual(expect.objectContaining({ id: 1, name: "Terra" }));
    });
  });

  describe('update', () => {
    it('should throw BadRequestException if passed no dto', async () => {
      await expect(service.update(1, null as any)).rejects.toThrow(BadRequestException);
    })

    it('should return a modified species', async () => {
      const speciesId = 1;

      const createDto: CreateSpeciesDto = {
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
        name: "Terra",
        people: [],
        skin_colors: "",
        url: ""

      };

      const result = await service.update(speciesId, createDto);

      expect(mockSpeciesRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({ id: speciesId, name: "Terra" })
      );

      expect(result).toEqual(
          expect.objectContaining({ id: speciesId, name: "Terra" })
      );
    })

  })

  describe('getByUrl', () => {
    it('should return planet by specified url', async () => {
      const url = "testUrl"
      const expectedplanet = {id: 1, name: 'TestplanetId'};

      mockSpeciesRepository.findOne.mockResolvedValue(expectedplanet);

      const planet = await service.getByUrl(url);

      expect(mockSpeciesRepository.findOne).toHaveBeenCalledWith(
          expect.objectContaining({where: {url: url}})
      );

      expect(planet).toEqual(expectedplanet);
    })
  })

  describe('get', () => {
    it('should return species by specified id', async () => {
      const speciesId = 1;
      const expectedplanet = {id: speciesId, name: 'TestSpeciesId'};

      mockSpeciesRepository.findOne.mockResolvedValue(expectedplanet);

      const planet = await service.get(speciesId);

      expect(mockSpeciesRepository.findOne).toHaveBeenCalledWith(
          expect.objectContaining({where: {id: speciesId}})
      );

      expect(planet).toEqual(expectedplanet);
    })
  })

  describe('getByName', () => {
    it('should return species by specified name', async () => {
      const speciesName = "TestNameSpecies"
      const expectedSpecies = {id: 1, name: speciesName};

      mockSpeciesRepository.findOne.mockResolvedValue(expectedSpecies);

      const species = await service.getByName(speciesName);

      expect(mockSpeciesRepository.findOne).toHaveBeenCalledWith(
          expect.objectContaining({where: {name: speciesName}})
      );

      expect(species).toEqual(expectedSpecies);
    })
  })
});
