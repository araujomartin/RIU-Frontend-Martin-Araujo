import { Observable } from 'rxjs';
import { CreateHero, Hero, UpdateHero } from './models/hero';
import { HeroFilter } from './models/hero-filter';
import { InjectionToken } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';

export interface HeroRepository {
    createHero(hero: CreateHero): Observable<Hero>;
    getAllHeroes(payload?: HeroFilter): Observable<Pagination<Hero>>;
    getHeroById(id: number): Observable<Hero>;
    updateHero(hero: UpdateHero): Observable<Hero>;
    deleteHero(id: number): Observable<void>;
}

export const HERO_REPOSITORY = new InjectionToken<HeroRepository>('HeroRepository');
