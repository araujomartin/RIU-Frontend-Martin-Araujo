import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroForm } from './hero-form';
import { HERO_REPOSITORY } from '../../domain/hero-repository';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { generateMockHero } from '../../mocks/generate-hero';
import { ComponentRef } from '@angular/core';

const newHeroMock = {
    name: 'Test',
    realName: 'Test',
    origin: 'Test',
    imageUrl: null,
    team: null,
    weakness: null
};

const mockHeroRepository = {
    createHero: jest.fn().mockReturnValue(of({
        ...newHeroMock,
        id: 1
    })),
    updateHero: jest.fn(),
};

describe('HeroForm', () => {
    let component: HeroForm;
    let fixture: ComponentFixture<HeroForm>;
    let componentRef: ComponentRef<HeroForm>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroForm],
            providers: [
                {
                    provide: HERO_REPOSITORY,
                    useValue: mockHeroRepository
                },
                {
                    provide: MessageService,
                    useValue: {
                        add: jest.fn()
                    }
                }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HeroForm);
        component = fixture.componentInstance;

        componentRef = fixture.componentRef;

        componentRef.setInput('selectedHero', undefined);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create a hero', () => {
        const form = component['heroForm']();

        form.setValue({
            name: 'Test',
            realName: 'Test',
            origin: 'Test',
            imageUrl: null,
            team: null,
            weakness: null
        });

        component['heroPowers'].set(['Power 1', 'Power 2']);

        component.createHero();
        expect(mockHeroRepository.createHero).toHaveBeenCalledWith({ name: 'Test', realName: 'Test', origin: 'Test', imageUrl: null, team: null, weakness: null, powers: ['Power 1', 'Power 2'] });

    });

    it('should update a hero', () => {
        const hero = generateMockHero(1);
        componentRef.setInput('selectedHero', {
            ...hero
        });

        fixture.detectChanges();
        
        const form = component['heroForm']();

        expect(form.invalid).toBe(false);
        
        form.controls.name.setValue('new name');
        const spy = jest.spyOn(mockHeroRepository, 'updateHero').mockReturnValue(of({ ...hero, name: 'new name' }));

        component.updateHero();

        expect(mockHeroRepository.updateHero).toHaveBeenCalledWith({ name: 'new name', id: hero.id });

        spy.mockClear();
        
    });

    it('should not update if properties are the same', () => {
        const hero = generateMockHero(10);

        componentRef.setInput('selectedHero', {
            ...hero
        });

        jest.spyOn(mockHeroRepository, 'updateHero');

        fixture.detectChanges();
        
        const form = component['heroForm']();

        console.log(form.controls.name.value);

        expect(form.invalid).toBe(false);
        
        component.updateHero();

        expect(mockHeroRepository.updateHero).not.toHaveBeenCalled();
        
    });
});
