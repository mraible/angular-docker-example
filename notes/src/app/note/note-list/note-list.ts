import { Component, OnInit, inject, signal, viewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Note } from '../note';
import { NoteFilter } from '../note-filter';
import { NoteService } from '../note-service';
import { Sortable, SortEvent } from './sortable';

@Component({
  selector: 'app-note-list',
  imports: [FormsModule, NgbPagination, RouterLink, Sortable],
  templateUrl: './note-list.html',
  styleUrl: './note-list.scss',
})
export class NoteList implements OnInit {
  private readonly noteService = inject(NoteService);
  private readonly headers = viewChildren(Sortable);

  protected filter: NoteFilter = { title: '', page: 0, size: 20 };
  protected page = 1;
  protected readonly notes = signal<Note[]>([]);
  protected readonly total = signal(0);
  protected readonly feedback = signal<{ type: string; message: string } | null>(null);

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.filter.page = this.page - 1;
    this.noteService.find(this.filter).subscribe({
      next: (page) => {
        this.notes.set(page.content);
        this.total.set(page.totalElements);
      },
      error: () => this.feedback.set({ type: 'warning', message: 'Error loading notes.' }),
    });
  }

  onSearch(): void {
    this.page = 1;
    this.search();
  }

  onSort({ column, direction }: SortEvent): void {
    // reset other headers
    for (const header of this.headers()) {
      if (header.sortable() !== column) {
        header.direction.set('');
      }
    }
    this.filter.column = column;
    this.filter.direction = direction;
    this.page = 1;
    this.search();
  }

  onPageSizeChange(): void {
    this.page = 1;
    this.search();
  }

  delete(note: Note): void {
    if (confirm('Are you sure?')) {
      this.noteService.delete(note).subscribe({
        next: () => {
          this.feedback.set({ type: 'success', message: 'Delete was successful!' });
          this.search();
        },
        error: () => this.feedback.set({ type: 'warning', message: 'Error deleting.' }),
      });
    }
  }
}
