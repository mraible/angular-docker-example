import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoteEdit } from './note-edit';

describe('NoteEdit', () => {
  let component: NoteEdit;
  let fixture: ComponentFixture<NoteEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteEdit],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteEdit);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'new');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
