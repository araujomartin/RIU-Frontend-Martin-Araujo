import { Component, input, model, output } from '@angular/core';
import { Hero } from '../domain/models/hero';

@Component({
    selector: 'app-hero-remove',
    template: ''
})
export class MockHeroRemove {
    public readonly hero = input.required<Hero>();
    public readonly visible = model(false);
    public readonly heroRemoved = output<Hero>();
}