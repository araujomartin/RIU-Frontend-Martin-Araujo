import { TestBed } from '@angular/core/testing';

import { HttpHeroDataClient } from './http-hero-data-client';

describe('HttpHeroDataClient', () => {
    let service: HttpHeroDataClient;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HttpHeroDataClient);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
