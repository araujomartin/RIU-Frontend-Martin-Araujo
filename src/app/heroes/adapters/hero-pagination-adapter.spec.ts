import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { heroRequestAdapter } from './hero-pagination-adapter';
import { Hero } from '../domain/models/hero';
import { generateMockHero } from '../mocks/generate-hero';

describe('heroRequestAdapter', () => {
    const mockHeroes: Hero[] = [
        generateMockHero(1),
        generateMockHero(2),
        generateMockHero(3)
    ];

    const createMockHeaders = (headerValue: string | null) => {
        return {
            get: jest.fn().mockReturnValue(headerValue)
        } as unknown as HttpHeaders;
    };

    it('should adapt response with X-Total-Count header', () => {
        const httpResponse = new HttpResponse<Hero[]>({
            body: mockHeroes,
            headers: createMockHeaders('25')
        });

        const result = heroRequestAdapter({
            httpResponse,
            page: 1,
            perPage: 10
        });

        expect(result).toEqual({
            actualPage: 1,
            totalPages: 3,
            dataLength: 25,
            data: mockHeroes
        });
    });
}); 