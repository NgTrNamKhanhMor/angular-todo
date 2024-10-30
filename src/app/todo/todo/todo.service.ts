import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from 'app/todo/types/todo';
import { environment } from 'environments/environments.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todo`;

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  addTodo(newTodo: Omit<Todo, 'id'>): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, newTodo);
  }

  updateTodo(updatedTodo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${updatedTodo.id}`, updatedTodo);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleComplete(id: string, completed: boolean): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, { completed });
  }
}
