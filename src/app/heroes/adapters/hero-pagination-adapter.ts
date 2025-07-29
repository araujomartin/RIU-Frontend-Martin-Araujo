import { HttpResponse } from '@angular/common/http';
import { Pagination } from '../../shared/models/pagination';
import { Hero } from '../domain/models/hero';

interface HeroResponseDto {
    httpResponse: HttpResponse<Hero[]>;
    perPage: number;
    page: number;
}

export function heroRequestAdapter({ httpResponse, page, perPage}: HeroResponseDto): Pagination<Hero> {
    const dataLength = Number(httpResponse.headers.get('X-Total-Count')) || httpResponse.body?.length || 0;
    const totalPages = Math.ceil(dataLength / perPage);
    const actualPage = page;
    return {
        actualPage,
        totalPages,
        dataLength,
        data: httpResponse.body || [],
    };
}