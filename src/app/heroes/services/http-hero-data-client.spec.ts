import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HttpHeroDataClient } from './http-hero-data-client';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { CreateHero } from '../domain/models/hero';
import { generateMockHero } from '../mocks/generate-hero';
import { firstValueFrom } from 'rxjs';

describe('HttpHeroDataClient', () => {
    let service: HttpHeroDataClient;
    let httpController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                HttpHeroDataClient,
                provideHttpClient(),
                provideHttpClientTesting()
            ],
        });

        service = TestBed.inject(HttpHeroDataClient);
        httpController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpController.verify();
    });

    it('HttpHeroDataClient: creates the service', () => {
        expect(service).toBeTruthy();
    });

    describe('createHero', () => {
        it('should create a hero', () => {
            const newHero: CreateHero =  generateMockHero(1);

            const createdHero = { id: 1, ...newHero };

            service.createHero(newHero).subscribe((hero) => {
                expect(hero).toEqual(createdHero);
            });

            const req = httpController.expectOne(service['baseUrl']);
            expect(req.request.method).toBe('POST');
            req.flush(createdHero);
        });

        it('should return a error', () => {
            const newHero: CreateHero =  generateMockHero(1);
            let createError: HttpErrorResponse | undefined;

            service.createHero(newHero).subscribe({
                next: () => {
                    fail('should not be called');
                },
                error: (err: HttpErrorResponse) => {
                    createError = err;
                }
            });

            const req = httpController.expectOne(service['baseUrl']);
            expect(req.request.method).toBe('POST');
            req.flush(null, { status: 500, statusText: 'Internal Server Error' });
        });
    });

    describe('getAllHeroes', () => {
        it('should return a list of heroes paginated if payload is not provided', () => {
            const mockHeroes = Array.from({
                length: 2
            }, (_, index) => generateMockHero(index + 1));

            const url = `${service['baseUrl']}?_page=1&_limit=10`;
            const serviceResponse = firstValueFrom(service.getAllHeroes());
            
            const req = httpController.expectOne(url);
            expect(req.request.method).toBe('GET');
            req.flush(mockHeroes, {
                headers: {
                    'X-Total-Count': mockHeroes.length.toString()
                }
            });

            expect(serviceResponse).resolves.toEqual({
                actualPage: 1,
                totalPages: 1,
                dataLength: mockHeroes.length,
                data: mockHeroes
            });
        });

        it('should call the correct url with query params', () => {

            service.getAllHeroes({ page: 3, perPage: 25, name: 'test' }).subscribe();

            const url = `${service['baseUrl']}?_page=3&_limit=25&name_like=test`;
            
            const req = httpController.expectOne(url);
            expect(req.request.method).toBe('GET');
            req.flush([]);
        });

        it('should return a error', () => {
            let getAllError: HttpErrorResponse | undefined;

            service.getAllHeroes().subscribe({
                next: () => {
                    fail('should not be called');
                },
                error: (err) => {
                    getAllError = err;
                }
            });
            
            const url = `${service['baseUrl']}?_page=1&_limit=10`;
            const req = httpController.expectOne(url);
            expect(req.request.method).toBe('GET');

            req.flush('error', { status: 500, statusText: 'Internal Server Error' });

            if (!getAllError) {
                fail('error should be defined');
            }

            expect(getAllError.status).toEqual(500);
            expect(getAllError.statusText).toEqual('Internal Server Error');
        });
    });

    describe('getHeroById', () => {
        it('should return a hero', () => {
            const id = 1;
            const mockHero = generateMockHero(id);
            const serviceResponse = firstValueFrom(service.getHeroById(id));

            const url = `${service['baseUrl']}/${id}`;
            const req = httpController.expectOne(url);
            expect(req.request.method).toBe('GET');
            req.flush(mockHero);

            expect(serviceResponse).resolves.toEqual(mockHero);
        });

        it('should return a error', () => {
            const id = 1;
            let getHeroError: HttpErrorResponse | undefined;

            service.getHeroById(id).subscribe({
                next: () => {
                    fail('should not be called');
                },
                error: (err) => {
                    getHeroError = err;
                }
            });

            const url = `${service['baseUrl']}/${id}`;
            const req = httpController.expectOne(url);
            expect(req.request.method).toBe('GET');

            req.flush('error', { status: 500, statusText: 'Internal Server Error' });

            if (!getHeroError) {
                fail('error should be defined');
            }

            expect(getHeroError.status).toEqual(500);
            expect(getHeroError.statusText).toEqual('Internal Server Error');
        });
    });

    describe('updateHero', () => {
        it('should update a hero', () => {
            const id = 1;
            const hero = generateMockHero(id);
            const serviceResponse = firstValueFrom(service.updateHero({
                id,
                name: 'new name'
            }));

            const url = `${service['baseUrl']}/${id}`;
            const req = httpController.expectOne(url);
            expect(req.request.method).toBe('PATCH');
            req.flush({
                ...hero,
                name: 'new name'
            });

            expect(serviceResponse).resolves.toEqual({
                ...hero,
                name: 'new name'
            });
        });

        it('should return a error', () => {
            const id = 1;
            let updateHeroError: HttpErrorResponse | undefined;

            service.updateHero({
                id,
                name: 'new name'
            }).subscribe({
                next: () => {
                    fail('should not be called');
                },
                error: (err) => {
                    updateHeroError = err;
                }
            });

            const url = `${service['baseUrl']}/${id}`;
            const req = httpController.expectOne(url);
            expect(req.request.method).toBe('PATCH');

            req.flush('error', { status: 500, statusText: 'Internal Server Error' });

            if (!updateHeroError) {
                fail('error should be defined');
            }

            expect(updateHeroError.status).toEqual(500);
            expect(updateHeroError.statusText).toEqual('Internal Server Error');
        });
    });

    describe('deleteHero', () => {
        it('should delete a hero', () => {
            const id = 1;
            const serviceResponse = firstValueFrom(service.deleteHero(id));

            const url = `${service['baseUrl']}/${id}`;
            const req = httpController.expectOne(url);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);

            expect(serviceResponse).resolves.toBeUndefined();
        });

        it('should return a error', () => {
            const id = 1;
            let deleteHeroError: HttpErrorResponse | undefined;

            service.deleteHero(id).subscribe({
                next: () => {
                    fail('should not be called');
                },
                error: (err) => {
                    deleteHeroError = err;
                }
            });

            const url = `${service['baseUrl']}/${id}`;
            const req = httpController.expectOne(url);
            expect(req.request.method).toBe('DELETE');

            req.flush('error', { status: 500, statusText: 'Internal Server Error' });

            if (!deleteHeroError) {
                fail('error should be defined');
            }

            expect(deleteHeroError.status).toEqual(500);
            expect(deleteHeroError.statusText).toEqual('Internal Server Error');
        });
    });
});
