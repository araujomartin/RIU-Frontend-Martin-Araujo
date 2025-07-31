import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { HeroFilter } from '../../domain/models/hero-filter';
import { HERO_REPOSITORY } from '../../domain/hero-repository';
import { HeroTable } from '../hero-table/hero-table';
import { Pagination, PaginationRequest } from '../../../shared/models/pagination';
import { Hero } from '../../domain/models/hero';

@Component({
    selector: 'app-hero-page',
    imports: [
        CardModule,
        TableModule,
        HeroTable,
    ],
    templateUrl: './hero-page.html',
    styleUrl: './hero-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroPage {
    private readonly heroRepository = inject(HERO_REPOSITORY);

    protected readonly initialValue: Pagination<Hero> = {
        actualPage: 1,
        totalPages: 1,
        dataLength: 0,
        data: []
    };

    protected readonly heroFilters = signal<HeroFilter>({
        page: 1,
        perPage: 5
    });

    protected readonly heroRx = rxResource({
        params: ()=> this.heroFilters(),
        stream: ({
            params
        }) => {
            return this.heroRepository.getAllHeroes(params);
        },
        defaultValue: this.initialValue,
    });

    updatePage(event: PaginationRequest) {
        const { page, perPage } = event;
        
        this.heroFilters.update((filters) => ({ ...filters, page, perPage }));
    }

    filterByName(partialName: string | undefined) {
        this.heroFilters.update((filters) => ({ ...filters, name: partialName, page: 1 }));
    }
}
