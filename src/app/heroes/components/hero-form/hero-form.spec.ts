import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroForm } from './hero-form';
import { HERO_REPOSITORY } from '../../domain/hero-repository';
import { MessageService } from 'primeng/api';
import { of, Subject, throwError } from 'rxjs';
import { generateMockHero } from '../../mocks/generate-hero';
import { ComponentRef } from '@angular/core';
import { Hero } from '../../domain/models/hero';

const newHeroMock = {
    name: 'Test',
    realName: 'Test',
    origin: 'Test',
    imageUrl: null,
    team: null,
    weakness: null
};

const mockHeroRepository = {
    createHero: jest.fn(),
    updateHero: jest.fn(),
};

describe('HeroForm', () => {
    let component: HeroForm;
    let fixture: ComponentFixture<HeroForm>;
    let componentRef: ComponentRef<HeroForm>;
    let messageService: MessageService;

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
        messageService = TestBed.inject(MessageService);

        componentRef = fixture.componentRef;

        componentRef.setInput('selectedHero', undefined);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create a hero', () => {
        const form = component['heroForm']();

        const spy = jest.spyOn(mockHeroRepository, 'createHero').mockReturnValue(of({
            ...newHeroMock,
            id: 1
        }));

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
        spy.mockClear();
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

        expect(form.invalid).toBe(false);
        
        component.updateHero();

        expect(mockHeroRepository.updateHero).not.toHaveBeenCalled();
        
    });

    it('should add power when power is not empty', () => {
        const inputRef = { value: 'Test Power' } as HTMLInputElement;
        
        component.addPower('Test Power', inputRef);
        
        expect(inputRef.value).toBe('');
        expect(component['heroPowers']()).toContain('Test Power');
    });

    it('should not add power when power is empty', () => {
        const inputRef = { value: 'Test Power' } as HTMLInputElement;
        const initialPowers = component['heroPowers']();
        
        component.addPower('', inputRef);
        
        expect(inputRef.value).toBe('Test Power'); // No se modifica
        expect(component['heroPowers']()).toEqual(initialPowers);
    });

    it('should remove power at specific index', () => {
        component['heroPowers'].set(['Power 1', 'Power 2', 'Power 3']);
        
        component.removePower(1);
        
        expect(component['heroPowers']()).toEqual(['Power 1', 'Power 3']);
    });

    it('should not create hero when form is invalid', () => {
        componentRef.setInput('selectedHero', undefined);

        fixture.detectChanges();
        
        const form = component['heroForm']();

        form.setValue({
            name: '',
            realName: 'Test',
            origin: 'Test',
            imageUrl: null,
            team: null,
            weakness: null
        });

        const spy = jest.spyOn(mockHeroRepository, 'createHero');
        
        component.createHero();
        
        expect(spy).not.toHaveBeenCalled();
        expect(form.dirty).toBe(true);
        expect(form.touched).toBe(true);
    });

    it('should not update hero when form is invalid', () => {
        const hero = generateMockHero(1);
        componentRef.setInput('selectedHero', hero);

        fixture.detectChanges();
        
        const form = component['heroForm']();
        form.setValue({
            name: '',
            realName: 'Test',
            origin: 'Test',
            imageUrl: null,
            team: null,
            weakness: null
        });

        const spy = jest.spyOn(mockHeroRepository, 'updateHero');
        
        component.updateHero();
        
        expect(spy).not.toHaveBeenCalled();
        expect(form.dirty).toBe(true);
        expect(form.touched).toBe(true);

        spy.mockClear();
    });

    describe('Should handle errors', () => {

        it('createHero error', () => {
            const error = new Error('Network error');
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const spy = jest.spyOn(mockHeroRepository, 'createHero').mockReturnValue(throwError(() => error));
            
            const form = component['heroForm']();
            form.setValue({
                name: 'Test',
                realName: 'Test',
                origin: 'Test',
                imageUrl: null,
                team: null,
                weakness: null
            });
            
            component.createHero();
            
            expect(messageService.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'Error al crear el heroe',
                detail: 'Ha ocurrido un error al crear el heroe'
            });
    
            consoleSpy.mockRestore();
            spy.mockClear();
    
        });
    
        it('updateHero error', () => {
            const hero = generateMockHero(1);
            componentRef.setInput('selectedHero', hero);
            fixture.detectChanges();
            
            const error = new Error('Network error');
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const spy = jest.spyOn(mockHeroRepository, 'updateHero').mockReturnValue(throwError(() => error));
            
            const form = component['heroForm']();
            form.controls.name.setValue('new name');
            
            component.updateHero();
            
            expect(messageService.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'Error al actualizar el heroe',
                detail: 'Ha ocurrido un error al actualizar el heroe'
            });
    
            consoleSpy.mockRestore();
            spy.mockClear();
    
        });
    });

    it('should emit newHero and show success message when hero is created successfully', () => {
        const hero = { ...newHeroMock, id: 1 };
        const spy = jest.spyOn(mockHeroRepository, 'createHero').mockReturnValue(of(hero));
        
        const form = component['heroForm']();
        form.setValue(newHeroMock);

        const emitSpy = jest.spyOn(component.newHero, 'emit');
        
        component.createHero();
        
        expect(emitSpy).toHaveBeenCalledWith(hero);
        expect(messageService.add).toHaveBeenCalledWith({
            severity: 'success',
            summary: 'Heroe creado',
            detail: 'El heroe ha sido creado correctamente'
        });
        expect(component.visible()).toBe(false);
        spy.mockClear();
    });

    it('should emit updatedHero and update selectedHero when hero is updated successfully', () => {
        const hero = generateMockHero(1);
        const updatedHero = { ...hero, name: 'Updated Name' };
        componentRef.setInput('selectedHero', hero);
        fixture.detectChanges();
        
        const spy = jest.spyOn(mockHeroRepository, 'updateHero').mockReturnValue(of(updatedHero));
        
        const form = component['heroForm']();
        form.controls.name.setValue('Updated Name');
        
        const emitSpy = jest.spyOn(component.updatedHero, 'emit');
        
        component.updateHero();
        
        expect(emitSpy).toHaveBeenCalledWith(updatedHero);
        expect(component.selectedHero()).toEqual(updatedHero);
        expect(messageService.add).toHaveBeenCalledWith({
            severity: 'success',
            summary: 'Heroe actualizado',
            detail: 'El heroe ha sido actualizado correctamente'
        });
        expect(component.visible()).toBe(false);
        spy.mockClear();
    });

    it('should handle optional fields correctly when creating hero', () => {
        const form = component['heroForm']();
        form.setValue({
            name: 'Test',
            realName: 'Test',
            origin: 'Test',
            imageUrl: 'https://example.com/image.jpg',
            team: 'Avengers',
            weakness: 'Kryptonite'
        });

        component['heroPowers'].set(['Power 1']);

        component.createHero();
        
        expect(mockHeroRepository.createHero).toHaveBeenCalledWith({
            name: 'Test',
            realName: 'Test',
            origin: 'Test',
            imageUrl: 'https://example.com/image.jpg',
            team: 'Avengers',
            weakness: 'Kryptonite',
            powers: ['Power 1']
        });
    });

    it('should handle optional fields correctly when updating hero', () => {
        const hero: Hero = {
            id: 90,
            name: 'Test',
            realName: 'Test',
            origin: 'Test',
            imageUrl: 'https://example.com/image.jpg',
            team: 'Avengers',
            weakness: 'Kryptonite',
            powers: []
        };

        componentRef.setInput('selectedHero', hero);
        fixture.detectChanges();
        
        const form = component['heroForm']();
        form.setValue({
            name: hero.name,
            realName: hero.realName,
            origin: hero.origin,
            imageUrl: hero.imageUrl,
            weakness: hero.weakness,
            team: null
        });

        const spy = jest.spyOn(mockHeroRepository, 'updateHero').mockReturnValue(of({ ...hero, team: null }));
        
        component.updateHero();
        
        expect(mockHeroRepository.updateHero).toHaveBeenCalledWith({
            team: null,
            id: hero.id
        });

        spy.mockClear();
    });

    describe('Should set loading state', ()=> {
        it('should set loading state correctly during create hero', () => {
            const form = component['heroForm']();
            const heroResponse = new Subject();

            form.setValue({
                name: 'Test',
                realName: 'Test',
                origin: 'Test',
                imageUrl: null,
                team: null,
                weakness: null
            });

            const spy = jest.spyOn(mockHeroRepository, 'createHero').mockReturnValue(heroResponse.asObservable());
    
            expect(component['isLoading']()).toBe(false);
            expect(form.invalid).toBe(false);
    
            component.createHero();
    
            fixture.detectChanges();
            
            expect(component['isLoading']()).toBe(true);

            heroResponse.next({
                ...form.getRawValue(),
                id: 1
            });
            heroResponse.complete();

            fixture.detectChanges();

            expect(component['isLoading']()).toBe(false);

            spy.mockClear();
        });

        it('should set loading state correctly during update hero', () => {
            const hero = generateMockHero(1);
            const heroResponse = new Subject();

            componentRef.setInput('selectedHero', hero);
            fixture.detectChanges();
        
            const form = component['heroForm']();
            form.controls.name.setValue('new name');
        
            const spy = jest.spyOn(mockHeroRepository, 'updateHero').mockReturnValue(heroResponse.asObservable());
        
            expect(component['isLoading']()).toBe(false);
        
            component.updateHero();

            fixture.detectChanges();
        
            expect(component['isLoading']()).toBe(true);

            heroResponse.next({
                ...form.getRawValue(),
                id: 2
            });

            heroResponse.complete();

            spy.mockClear();

            expect(component['isLoading']()).toBe(false);

        });
    });

    describe('heroPowers', ()=> {
        it('should initialize heroPowers correctly when selectedHero is undefined', () => {
            componentRef.setInput('selectedHero', undefined);
            fixture.detectChanges();
            
            expect(component['heroPowers']()).toEqual([]);
        });
    
        it('should initialize heroPowers correctly when selectedHero has powers', () => {
            const hero = generateMockHero(1);
            componentRef.setInput('selectedHero', hero);
            fixture.detectChanges();
            
            expect(component['heroPowers']()).toEqual(hero.powers);
        });
    });

});
