import { Component, input, model } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';
import { Hero } from '../domain/models/hero';

@Component({
    selector: 'app-hero-table',
    template: ''
})
export class MockHeroTable {
    public readonly paginatedHeroes = model<Pagination<Hero>>();
    public readonly isLoading = input(false);

    public readonly error = input<Error>();

    public readonly perPage = input(10);
}