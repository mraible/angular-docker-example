import { Directive, input, model, output } from '@angular/core';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: Record<SortDirection, SortDirection> = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction() === "asc"',
    '[class.desc]': 'direction() === "desc"',
    '(click)': 'rotate()',
  },
})
export class Sortable {
  readonly sortable = input.required<string>();
  readonly direction = model<SortDirection>('');
  readonly sort = output<SortEvent>();

  rotate(): void {
    this.direction.set(rotate[this.direction()]);
    this.sort.emit({ column: this.sortable(), direction: this.direction() });
  }
}
