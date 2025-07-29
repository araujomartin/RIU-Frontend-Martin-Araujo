import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { Hero } from '../../domain/models/hero';
import { Pagination } from '../../../shared/models/pagination';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { PowerCell } from './power-cell/power-cell';
import { HeroForm } from '../hero-form/hero-form';
import { SkeletonModule } from 'primeng/skeleton';
import { HeroRemove } from '../hero-remove/hero-remove';

@Component({
    selector: 'app-hero-table',
    imports: [
        TableModule,
        PaginatorModule,
        AvatarModule,
        ButtonModule,
        InputTextModule,
        InputGroupModule,
        FormsModule,
        TagModule,
        PowerCell,
        HeroForm,
        SkeletonModule,
        HeroRemove
    ],
    templateUrl: './hero-table.html',
    styleUrl: './hero-table.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroTable {
    public readonly paginatedHeroes = model<Pagination<Hero>>();
    public readonly isLoading = input(false);

    public readonly perPage = input(10);

    protected selectedHero = signal<Hero | undefined>(undefined);
    protected displayHeroRemoveDialog = signal(false);

    protected readonly zeroRelativePage = computed(()=> {
        const paginatedHeroes = this.paginatedHeroes();
        const perPage = this.perPage();

        if (!paginatedHeroes) {
            return 0;
        }

        const { actualPage,  } = paginatedHeroes;

        return (actualPage - 1) * perPage;
    });

    public readonly changePage = output<number>();
    public readonly nameFilterChange = output<string | undefined>();

    pageEvent(event: PaginatorState) {
        const nextPage = event.page! + 1;
        const { actualPage } = this.paginatedHeroes()!;

        if (nextPage === actualPage) {
            return;
        }

        this.changePage.emit(nextPage);
    }

    filterByName(partialName: string | undefined) {
        this.nameFilterChange.emit(partialName? partialName.trim() : undefined);
    }

    updateHero(hero: Hero) {
        if (!this.paginatedHeroes()) {
            return;
        }

        this.paginatedHeroes.update((state)=> {
            return {
                ...state!,
                data: state!.data.map((h) => h.id === hero.id ? hero : h)
            };
        });
    }

    removeHero(hero: Hero) {
        if (!this.paginatedHeroes()) {
            return;
        }

        this.paginatedHeroes.update((state)=> {
            return {
                ...state!,
                data: state!.data.filter((h) => h.id === hero.id ? hero : h)
            };
        });
    }
}
