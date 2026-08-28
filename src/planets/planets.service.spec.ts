import {PlanetsService} from "./planets.service";
import {Test, TestingModule} from "@nestjs/testing";
import {HttpService} from "@nestjs/axios";
import {CreatePlanetDto} from "./model/planet.dto";
import {BadRequestException} from "@nestjs/common";
import {Like} from "typeorm";


describe('PlanetsService', () => {
  let service: PlanetsService;

  const mockPlanetsRepository = {
    find: jest.fn().mockResolvedValue([{id: 1, title: 'Inception'}]),
    findOne: jest.fn(),
    save: jest.fn().mockImplementation((planet) => Promise.resolve({id: planet.id || 1, ...planet})),
    create: jest.fn().mockImplementation((dto) => dto),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetsService,
        {
          provide: 'PLANET_REPOSITORY',
          useValue: mockPlanetsRepository,
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PlanetsService>(PlanetsService);
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
    it('should save and return a planet', async () => {
      const createDto: CreatePlanetDto = {
        climate: "",
        created: "",
        diameter: "",
        edited: "",
        films: [],
        gravity: "",
        imgs: [],
        name: "Terra",
        orbital_period: "",
        population: "",
        rotation_period: "",
        surface_water: "",
        terrain: "",
        url: ""

      };

      const newPlanet = await service.add(createDto as CreatePlanetDto);

      expect(newPlanet).toEqual(expect.objectContaining({ id: 1, name: "Terra" }));
    });
  });

  describe('update', () => {
    it('should throw BadRequestException if passed no dto', async () => {
      await expect(service.update(1, null as any)).rejects.toThrow(BadRequestException);
    })

    it('should return a modified planet', async () => {
      const planetId = 1;

      const createDto: CreatePlanetDto = {
        climate: "",
        created: "",
        diameter: "",
        edited: "",
        films: [],
        gravity: "",
        imgs: [],
        name: "Terra",
        orbital_period: "",
        population: "",
        rotation_period: "",
        surface_water: "",
        terrain: "",
        url: ""

      };

      const result = await service.update(planetId, createDto as CreatePlanetDto);

      expect(mockPlanetsRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({ id: planetId, name: "Terra" })
      );

      expect(result).toEqual(
          expect.objectContaining({ id: planetId, name: "Terra" })
      );
    })

  })

  describe('getByUrl', () => {
    it('should return planet by specified url', async () => {
      const url = "testUrl"
      const expectedplanet = {id: 1, name: 'TestplanetId'};

      mockPlanetsRepository.findOne.mockResolvedValue(expectedplanet);

      const planet = await service.getByUrl(url);

      expect(mockPlanetsRepository.findOne).toHaveBeenCalledWith(
          expect.objectContaining({where: {url: url}})
      );

      expect(planet).toEqual(expectedplanet);
    })
  })

  describe('get', () => {
    it('should return planet by specified id', async () => {
      const planetId = 1;
      const expectedplanet = {id: planetId, name: 'TestplanetId'};

      mockPlanetsRepository.findOne.mockResolvedValue(expectedplanet);

      const planet = await service.get(planetId);

      expect(mockPlanetsRepository.findOne).toHaveBeenCalledWith(
          expect.objectContaining({where: {id: planetId}})
      );

      expect(planet).toEqual(expectedplanet);
    })
  })

  describe('getByName', () => {
    it('should return planet by specified name', async () => {
      const planetName = "TestNameplanet"
      const expectedPlanet = {id: 1, name: planetName};

      mockPlanetsRepository.find.mockResolvedValue(expectedPlanet);

      const planet = await service.getByName(planetName);

      expect(mockPlanetsRepository.findOne).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { name: Like(`%${planetName}%`) },
            skip: undefined,
            take: undefined
          })
      );

      expect(planet).toEqual(expectedPlanet);
    })
  })
});