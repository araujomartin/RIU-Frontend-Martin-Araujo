
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroTable } from './hero-table';
import { ComponentRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HeroForm } from '../hero-form/hero-form';
import { HeroRemove } from '../hero-remove/hero-remove';
import { MockHeroForm } from '../../mocks/hero-form';
import { MockHeroRemove } from '../../mocks/hero-remove';

describe('HeroTable', () => {
    let component: HeroTable;
    let fixture: ComponentFixture<HeroTable>;
    let componentRef: ComponentRef<HeroTable>;

    const mockPaginatedHeroes = {
        actualPage: 1,
        totalPages: 1,
        dataLength: 1,
        data: [
            {
                id: 1,
                name: 'Superman',
                realName: 'Clark Kent',
                powers: ['Vuelo', 'Fuerza'],
                origin: 'Krypton'
            }
        ]
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroTable],
            providers: [
                {
                    provide: MessageService,
                    useValue: {
                        add: jest.fn()
                    }
                }
            ]

        }).overrideComponent(HeroTable, {
            remove: {
                imports: [
                    HeroForm,
                    HeroRemove
                ]
            },
            add: {
                imports: [
                    MockHeroForm,
                    MockHeroRemove
                ]
            }
        }).compileComponents();

        fixture = TestBed.createComponent(HeroTable);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;

        componentRef.setInput('paginatedHeroes', mockPaginatedHeroes);
        componentRef.setInput('isLoading', false);
        componentRef.setInput('perPage', 4);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render hero data', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Superman');
        expect(compiled.textContent).toContain('Clark Kent');
    });

});
