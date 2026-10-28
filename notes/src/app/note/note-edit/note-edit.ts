import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Note } from '../note';
import { NoteService } from '../note-service';

@Component({
  selector: 'app-note-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './note-edit.html',
  styleUrl: './note-edit.scss',
})
export class NoteEdit implements OnInit {
  private readonly noteService = inject(NoteService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();
  protected note = signal<Note | null>(null);
  protected readonly feedback = signal<{ type: string; message: string } | null>(null);

  ngOnInit(): void {
    if (this.id() === 'new') {
      this.note.set({ title: '', text: '' });
      return;
    }
    this.noteService.findById(this.id()).subscribe({
      next: (note) => this.note.set(note),
      error: () => this.feedback.set({ type: 'warning', message: 'Error loading.' }),
    });
  }

  save(note: Note): void {
    this.noteService.save(note).subscribe({
      next: (saved) => {
        this.note.set(saved);
        this.feedback.set({ type: 'success', message: 'Save was successful!' });
        setTimeout(() => this.router.navigate(['/notes']), 1000);
      },
      error: () => this.feedback.set({ type: 'warning', message: 'Error saving.' }),
    });
  }

  cancel(): void {
    this.router.navigate(['/notes']);
  }
}
