import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { Home } from './home/home';
import { NoteEdit } from './note/note-edit/note-edit';
import { NoteList } from './note/note-list/note-list';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: Home,
  },
  { path: 'notes', component: NoteList, canActivate: [authGuardFn] },
  { path: 'notes/:id', component: NoteEdit, canActivate: [authGuardFn] },
];
