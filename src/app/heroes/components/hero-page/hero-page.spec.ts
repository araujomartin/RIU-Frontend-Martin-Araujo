import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroPage } from './hero-page';
import { HERO_REPOSITORY } from '../../domain/hero-repository';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { HeroTable } from '../hero-table/hero-table';
import { MockHeroTable } from '../../mocks/hero-table';

describe('HeroPage', () => {
    let component: HeroPage;
    let fixture: ComponentFixture<HeroPage>;

    const mockHeroRepository = {
        getAllHeroes: jest.fn().mockReturnValue(of({
            actualPage: 1,
            totalPages: 1,
            dataLength: 1,
            data: [{ id: 1, name: 'Test', realName: 'Test', powers: [], origin: 'Test' }]
        }))
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HeroPage],
            providers: [
                { provide: HERO_REPOSITORY, useValue: mockHeroRepository },
                {
                    provide: MessageService,
                    useValue: {
                        add: jest.fn()
                    }
                },
            ]
        }).overrideComponent(HeroPage, {
            remove: {
                imports: [
                    HeroTable
                ]
            },
            add: {
                imports: [
                    MockHeroTable
                ]
            }
        });
        fixture = TestBed.createComponent(HeroPage);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update page', () => {
        component.updatePage(2);
        expect(component['heroFilters']().page).toBe(2);
    });

    it('should filter by name', () => {
        component.filterByName('Spider');
        expect(component['heroFilters']().name).toBe('Spider');
        expect(component['heroFilters']().page).toBe(1);
    });
});