import { Component, model, output } from '@angular/core';
import { Hero } from '../domain/models/hero';

@Component({
    selector: 'app-hero-form',
    template: ''
})
export class MockHeroForm {
    public readonly visible = model(false);
    public readonly selectedHero = model<Hero | undefined>(undefined);

    public readonly updatedHero = output<Hero>();
}