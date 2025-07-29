import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-power-cell',
    imports: [
        TagModule,
        PopoverModule,
        ButtonModule
    ],
    templateUrl: './power-cell.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PowerCell {
    public readonly powers = input<string[]>();
    
    protected readonly firstPower = computed(() => {
        const powers = this.powers();

        if (!powers) {
            return null;
        }

        return powers[0];
    });
}
