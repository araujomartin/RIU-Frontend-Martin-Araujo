import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroRemove } from './hero-remove';
import { MessageService } from 'primeng/api';
import { HERO_REPOSITORY } from '../../domain/hero-repository';
import { ComponentRef } from '@angular/core';

const mockHeroRepository = {
    deleteHero: jest.fn(),
};

describe('HeroRemove', () => {
    let component: HeroRemove;
    let fixture: ComponentFixture<HeroRemove>;
    let componentRef : ComponentRef<HeroRemove>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroRemove],
            providers: [
                {
                    provide: MessageService,
                    useValue: {
                        add: jest.fn()
                    }
                },
                {
                    provide: HERO_REPOSITORY,
                    useValue: mockHeroRepository
                }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HeroRemove);
        component = fixture.componentInstance;

        componentRef = fixture.componentRef;

        componentRef.setInput('hero', {
            id: 1,
            name: 'Superman',
            realName: 'Clark Kent',
            powers: ['Vuelo', 'Fuerza'],
            origin: 'Krypton'
        });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
