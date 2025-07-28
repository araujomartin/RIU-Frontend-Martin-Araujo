import { makeEnvironmentProviders } from '@angular/core';
import { HERO_REPOSITORY } from './hero-repository';
import { HttpHeroDataClient } from '../services/http-hero-data-client';

export function provideHeroDataClient() {
    return makeEnvironmentProviders([
        {
            provide: HERO_REPOSITORY,
            useClass: HttpHeroDataClient
        }
    ]);
}