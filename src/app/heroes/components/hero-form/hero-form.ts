import { ChangeDetectionStrategy, Component, model, computed, linkedSignal, inject, signal, output } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CreateHero, Hero, UpdateHero } from '../../domain/models/hero';
import { TagModule } from 'primeng/tag';
import { InputGroupModule } from 'primeng/inputgroup';
import { HERO_REPOSITORY } from '../../domain/hero-repository';
import { patchObject } from '../../../shared/utils/patch-object';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-hero-form',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        TagModule,
        InputGroupModule
    ],
    templateUrl: './hero-form.html',
    styleUrl: './hero-form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroForm {
    private readonly heroRepository = inject(HERO_REPOSITORY);
    private readonly messageService = inject(MessageService);

    public readonly visible = model(false);
    public readonly selectedHero = model<Hero | undefined>(undefined);

    public readonly updatedHero = output<Hero>();
    public readonly newHero = output<Hero>();

    protected readonly isLoading = signal(false);

    protected readonly heroPowers = linkedSignal({
        source: this.selectedHero,
        computation: () => {
            const hero = this.selectedHero();
            return hero ? hero.powers : [];
        }
    });

    protected readonly heroForm = computed(() => {
        const hero = this.selectedHero();
        return new FormGroup({
            name: new FormControl<string | null>(hero?.name ?? null, { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
            realName: new FormControl<string | null>(hero?.realName ?? null, { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
            origin: new FormControl<string | null>(hero?.origin ?? null, { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
            weakness: new FormControl<string | null>(hero?.weakness ?? null, { validators: [Validators.maxLength(100)] }),
            team: new FormControl<string | null>(hero?.team ?? null, { validators: [Validators.maxLength(100)] }),
            imageUrl: new FormControl<string | null>(hero?.imageUrl ?? null)
        });
    });

    addPower(power: string) {
        const powers = this.heroPowers().slice();
        powers.push(power);
        this.heroPowers.set(powers);
    }

    removePower(index: number) {
        const powers = this.heroPowers().slice();
        powers.splice(index, 1);
        this.heroPowers.set(powers);
    }

    createHero() {
        if (this.heroForm().invalid) {
            this.heroForm().markAllAsDirty();
            this.heroForm().markAsDirty();
            this.heroForm().markAllAsTouched();
            return;
        }

        const newHero: CreateHero = {
            name: this.heroForm().value.name!,
            realName: this.heroForm().value.realName!,
            origin: this.heroForm().value.origin!,
            weakness: this.heroForm().value.weakness || null,
            team: this.heroForm().value.team || null,
            imageUrl: this.heroForm().value.imageUrl || null,
            powers: this.heroPowers()
        };

        this.isLoading.set(true);

        this.heroRepository.createHero(newHero).subscribe({
            next: (hero) => {
                this.newHero.emit(hero);
                this.isLoading.set(false);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Heroe creado',
                    detail: 'El heroe ha sido creado correctamente'
                });
                this.visible.set(false);
            },
            error: (error) => {
                this.isLoading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error al crear el heroe',
                    detail: 'Ha ocurrido un error al crear el heroe'
                });
                console.error(error);
            }
        });
    }

    updateHero() {
        if (this.heroForm().invalid) {
            this.heroForm().markAllAsDirty();
            this.heroForm().markAsDirty();
            this.heroForm().markAllAsTouched();
            return;
        }

        const updatedHero: UpdateHero = {
            id: this.selectedHero()!.id,
            name: this.heroForm().value.name!,
            realName: this.heroForm().value.realName!,
            origin: this.heroForm().value.origin!,
            weakness: this.heroForm().value.weakness || null,
            team: this.heroForm().value.team || null,
            imageUrl: this.heroForm().value.imageUrl || null,
            powers: this.heroPowers()
        };

        const patchedHero = patchObject(this.selectedHero()!, updatedHero);

        if (Object.keys(patchedHero).length === 0) {
            this.messageService.add({
                severity: 'info',
                summary: 'Sin cambios',
                detail: 'No se han realizado cambios en el heroe'
            });
            this.visible.set(false);
            return;
        }

        this.isLoading.set(true);

        this.heroRepository.updateHero({
            ...patchedHero,
            id: this.selectedHero()!.id
        }).subscribe({
            next: (hero) => {
                this.updatedHero.emit(hero);
                this.selectedHero.set(hero);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Heroe actualizado',
                    detail: 'El heroe ha sido actualizado correctamente'
                });
                this.visible.set(false);
                this.isLoading.set(false);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error al actualizar el heroe',
                    detail: 'Ha ocurrido un error al actualizar el heroe'
                });
                this.isLoading.set(false);
                console.error(error);
            }
        });
    }
}
