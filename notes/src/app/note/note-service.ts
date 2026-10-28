import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from './note';
import { NoteFilter } from './note-filter';
import { environment } from '../../environments/environment';

export interface Page<T> {
  content: T[];
  totalElements: number;
}

@Service()
export class NoteService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/api/notes`;

  find(filter: NoteFilter): Observable<Page<Note>> {
    const params: Record<string, string | number> = {
      title: filter.title,
      size: filter.size,
      page: filter.page,
    };
    if (filter.column && filter.direction) {
      params['sort'] = `${filter.column},${filter.direction}`;
    }
    return this.http.get<Page<Note>>(`${environment.apiUrl}/user/notes`, { params });
  }

  findById(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.api}/${id}`);
  }

  save(note: Note): Observable<Note> {
    return note.id
      ? this.http.put<Note>(`${this.api}/${note.id}`, note)
      : this.http.post<Note>(this.api, note);
  }

  delete(note: Note): Observable<void> {
    return this.http.delete<void>(`${this.api}/${note.id}`);
  }
}
