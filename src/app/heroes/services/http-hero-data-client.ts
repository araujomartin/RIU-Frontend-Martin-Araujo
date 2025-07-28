import { Injectable } from '@angular/core';
import { HeroRepository } from '../domain/hero-repository';
import { Observable } from 'rxjs';
import { Hero } from '../domain/models/hero';
import { HeroFilter } from '../domain/models/hero-filter';
import { Pagination } from '../../shared/models/pagination';

@Injectable({
    providedIn: 'root'
})
export class HttpHeroDataClient implements HeroRepository {
    private baseUrl = 'http://localhost:3000'; // Example base URL

    createHero(hero: Hero): Observable<Hero> {
        throw new Error('Method not implemented.');
    }
    getAllHeroes(payload?: HeroFilter): Observable<Pagination<Hero>> {
        throw new Error('Method not implemented.');
    }
    getHeroById(id: number): Observable<Hero> {
        throw new Error('Method not implemented.');
    }
    updateHero(hero: Hero): Observable<Hero> {
        throw new Error('Method not implemented.');
    }
    deleteHero(id: number): Observable<Hero> {
        throw new Error('Method not implemented.');
    }
  
}
