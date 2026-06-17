import * as https from "node:https";
import {HttpService} from "@nestjs/axios";
import {FilmsService} from "../films/films.service";
import {PeopleService} from "../people/people.service";
import {PlanetsService} from "../planets/planets.service";
import {SpeciesService} from "../species/species.service";
import {StarshipsService} from "../starships/starships.service";
import {VehiclesService} from "../vehicles/vehicles.service";
import {firstValueFrom} from "rxjs";
import {AxiosResponse} from "axios";
import {Injectable} from "@nestjs/common";

@Injectable()
export class SeederService {
    private readonly agent = new https.Agent({rejectUnauthorized: false});

    constructor(
        private readonly httpService: HttpService,
        private readonly filmsService: FilmsService,
        private readonly peopleService: PeopleService,
        private readonly planetsService: PlanetsService,
        private readonly speciesService: SpeciesService,
        private readonly starshipsService: StarshipsService,
        private readonly vehiclesService: VehiclesService,
    ) {
    }

    async onApplicationBootstrap() {
        const filmsCount = await this.filmsService.getAll();
        if (filmsCount.length > 0) {
            return;
        }

        await this.runComprehensiveSeed();
    }

    // private extractIds(urls: string[]) {
    //     if (!urls || !Array.isArray(urls)) {
    //         return [];
    //     }
    //
    //     return urls.map(url => {
    //         const matches = url.match(/\/([0-9]+)\/$/);
    //         return matches ? Number(matches[1]) : null;
    //     }).filter((id): id is number => typeof id === 'number' && !isNaN(id) && id > 0);
    // }

    private async mapLinkToId(service: any, urls: string[]) {
        if (!urls || !Array.isArray(urls)) {
            return [];
        }

        const urlArray = (Array.isArray(urls) ? urls : [urls]).filter(url => url && typeof url === 'string' && url.trim() !== '');
        const ids: number[] = []

        for (const url of urlArray) {
            try {
                const entity = await service.getByUrl(url);
                if (entity && entity.id && !isNaN(Number(entity.id))) {
                    ids.push(entity.id);
                } else {
                    console.warn(`entity with url ${url} not found`);
                }
            } catch (e) {
                console.error(e);
            }
        }

        return ids;
    }

    private async fetchAllPages(endpoint: string): Promise<any[]> {
        let link: string | null = `https://swapi.dev/api/${endpoint}/`;
        const allResults: any[] = [];

        while (link) {
            try {
                const res: AxiosResponse<any, any, {}> = await firstValueFrom(this.httpService.get(link, {httpsAgent: this.agent}));
                allResults.push(...res.data.results);
                link = res.data.next ? res.data.next.replace('http://', 'https://') : null;
            } catch (e) {
                link = null;
            }
        }
        return allResults;
    }

    async runComprehensiveSeed() {
        try {
            console.log('Loading data for seeding');

            const rawFilms = await this.fetchAllPages('films');
            const rawPlanets = await this.fetchAllPages('planets');
            const rawSpecies = await this.fetchAllPages('species');
            const rawStarships = await this.fetchAllPages('starships');
            const rawVehicles = await this.fetchAllPages('vehicles');
            const rawPeople = await this.fetchAllPages('people');

            console.log('Seeding unlinked entities');

            console.log('Seeding unlinked films');
            for (const f of rawFilms) {
                await this.filmsService.add({
                    ...f,
                    characters: [],
                    species: [],
                    vehicles: [],
                    starships: [],
                    planets: []
                });
            }

            console.log('Seeding unlinked planets');
            for (const p of rawPlanets) {
                await this.planetsService.add({
                    ...p,
                    diameter: isNaN(Number(p.diameter)) ? null : Number(p.diameter),
                    population: isNaN(Number(p.population)) ? null : Number(p.population),
                    films: []
                });
            }

            console.log('Seeding unlinked species');
            for (const s of rawSpecies) {
                await this.speciesService.add({...s, people: [], films: [], homeworld: null});
            }

            console.log('Seeding unlinked starships');
            for (const st of rawStarships) {
                await this.starshipsService.add({...st, pilots: [], films: []});
            }

            console.log('Seeding unlinked vehicles');
            for (const v of rawVehicles) {
                await this.vehiclesService.add({...v, pilots: [], films: []});
            }

            console.log('Seeding unlinked people');
            for (const pp of rawPeople) {
                await this.peopleService.add({
                    ...pp,
                    height: isNaN(Number(pp.height)) ? null : Number(pp.height),
                    mass: isNaN(Number(pp.mass)) ? null : Number(pp.mass),
                    films: [], species: [], vehicles: [], starships: [], homeworld: null
                });
            }

            console.log('Linking entities');


            for (const f of rawFilms) {
                const dbFilm = await this.filmsService.getByTitle(f.title);
                if (dbFilm) {
                    await this.filmsService.update(dbFilm.id, {
                        ...f,
                        characters: await this.mapLinkToId(this.peopleService, f.characters),
                        species: await this.mapLinkToId(this.speciesService, f.species),
                        vehicles: await this.mapLinkToId(this.vehiclesService, f.vehicles),
                        starships: await this.mapLinkToId(this.starshipsService, f.starships),
                        planets: await this.mapLinkToId(this.planetsService, f.planets),
                    });
                }
            }

            for (const p of rawPeople) {
                const dbPerson = await this.peopleService.getByName(p.name);
                if (dbPerson) {
                    const homeworldId = await this.mapLinkToId(this.planetsService, [p.homeworld])[0]

                    await this.peopleService.update(dbPerson.id, {
                        ...p,
                        height: isNaN(Number(p.height)) ? null : Number(p.height),
                        mass: isNaN(Number(p.mass)) ? null : Number(p.mass),
                        films: await this.mapLinkToId(this.filmsService, p.films),
                        species: await this.mapLinkToId(this.speciesService, p.species),
                        vehicles: await this.mapLinkToId(this.vehiclesService, p.vehicles),
                        starships: await this.mapLinkToId(this.starshipsService, p.starships),
                        homeworld: homeworldId
                    });
                }
            }

            for (const s of rawSpecies) {
                const dbSpecies = await this.speciesService.getByName(s.name);
                if (dbSpecies) {
                    const homeworldId = await this.mapLinkToId(this.peopleService, [s.homeworld])[0]

                    await this.speciesService.update(dbSpecies.id, {
                        ...s,
                        homeworld: homeworldId,
                        films: await this.mapLinkToId(this.filmsService, s.films),
                        people: await this.mapLinkToId(this.peopleService, s.people),
                    } as any);
                }
            }


        } catch (error) {
            console.error('Error seeding:', error);
        }
    }
}