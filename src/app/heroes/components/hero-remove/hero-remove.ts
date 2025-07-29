import { ChangeDetectionStrategy, Component, inject, input, model, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Hero } from '../../domain/models/hero';
import { HERO_REPOSITORY } from '../../domain/hero-repository';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-hero-remove',
    imports: [
        DialogModule,
        ButtonModule
    ],
    templateUrl: './hero-remove.html',
    styleUrl: './hero-remove.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroRemove {
    private readonly heroRepository = inject(HERO_REPOSITORY);

    private readonly messageService = inject(MessageService);

    public readonly hero = input.required<Hero>();
    public readonly visible = model(false);
    public readonly heroRemoved = output<Hero>();

    protected readonly isLoading = signal(false);

    removeHero() {
        const { id } = this.hero();

        this.isLoading.set(true); 

        this.heroRepository.deleteHero(id).subscribe({
            next: () => {
                this.heroRemoved.emit(this.hero());
                this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Heroe eliminado' });
                this.visible.set(false);
            },
            error: () => {
                this.isLoading.set(false);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al eliminar el heroe' });
            }
        });
    }

}
