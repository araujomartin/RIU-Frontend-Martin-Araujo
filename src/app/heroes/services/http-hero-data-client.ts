import { inject, Injectable } from '@angular/core';
import { HeroRepository } from '../domain/hero-repository';
import { catchError, map, throwError } from 'rxjs';
import { CreateHero, Hero, UpdateHero } from '../domain/models/hero';
import { HeroFilter } from '../domain/models/hero-filter';
import { HttpClient, HttpParams } from '@angular/common/http';
import { heroRequestAdapter } from '../adapters/hero-pagination-adapter';

@Injectable({
    providedIn: 'root'
})
export class HttpHeroDataClient implements HeroRepository {
    private readonly http = inject(HttpClient);

    // run bun api command to start the server
    private readonly baseUrl = 'http://localhost:3000/heroes';

    createHero(hero: CreateHero) {
        return this.http.post<Hero>(this.baseUrl, hero).pipe(
            catchError((err) => throwError(() => err))
        );
    }

    getAllHeroes(payload?: HeroFilter) {
        let params = new HttpParams()
            .set('_page', payload?.page?.toString() || '1')
            .set('_limit', payload?.perPage?.toString() || '10');
        
        if (payload?.name) {
            params =  params.set('name_like', payload.name);
        }

        // observe: 'response' to get headers and body
        return this.http.get<Hero[]>(this.baseUrl, {
            observe: 'response',
            params
        }).pipe(
            map((httpResponse) => heroRequestAdapter({
                httpResponse,
                page: Number(params.get('_page')),
                perPage: Number(params.get('_limit'))
            })),
            catchError((err)=> throwError(() => err))
        );
    }
    
    getHeroById(id: number) {
        return this.http.get<Hero>(`${this.baseUrl}/${id}`).pipe(
            catchError((err) => throwError(() => err))
        );
    }

    updateHero(hero: UpdateHero){
        return this.http.patch<Hero>(`${this.baseUrl}/${hero.id}`, hero).pipe(
            catchError((err) => throwError(() => err))
        );
    }

    deleteHero(id: number) {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
            map(() => void 0), // map to void since delete does not return anything
            catchError((err) => throwError(() => err))
        );
    }

}
