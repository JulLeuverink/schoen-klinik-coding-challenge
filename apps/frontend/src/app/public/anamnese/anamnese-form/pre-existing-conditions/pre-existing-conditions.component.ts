import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CONDITIONS } from './conditions.constants';
import { PreExistingConditionsValue } from './pre-existing-conditions-value.type';

@Component({
  selector: 'app-pre-existing-conditions',
  imports: [FormsModule],
  templateUrl: './pre-existing-conditions.component.html',
  styleUrl: './pre-existing-conditions.component.css',
})
export class PreExistingConditionsComponent {
  value = input<PreExistingConditionsValue | null>(null);
  valueChange = output<PreExistingConditionsValue | null>();
  CONDITIONS = CONDITIONS;

  selected = computed(() => this.value()?.selected ?? []);
  showOther = computed(() => this.selected().includes('Sonstiges'));

  toggleConditions(condition: string): void {
    const currentSelectedConditions = this.selected();
    const newSelectedConditions = currentSelectedConditions.includes(condition)
      ? currentSelectedConditions.filter((c) => c !== condition)
      : [...currentSelectedConditions, condition];
    this.emitValueChange(newSelectedConditions, this.value()?.other);
  }

  updateOther(value: string) {
    this.emitValueChange(this.selected(), value || undefined);
  }

  private emitValueChange(selected: string[], other?: string) {
    if (selected.length === 0) {
      this.valueChange.emit(null);
      return;
    }
    this.valueChange.emit({
      selected: selected,
      other: other,
    });
  }
}
