import { Observable } from 'rxjs';
import { Hero } from './models/hero';
import { HeroFilter } from './models/hero-filter';
import { InjectionToken } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';

export interface HeroRepository {
    createHero(hero: Hero): Observable<Hero>;
    getAllHeroes(payload?: HeroFilter): Observable<Pagination<Hero>>;
    getHeroById(id: number): Observable<Hero>;
    updateHero(hero: Hero): Observable<Hero>;
    deleteHero(id: number): Observable<Hero>;
}

export const HERO_REPOSITORY = new InjectionToken<HeroRepository>('HeroRepository');
