import { CommonModule } from '@angular/common';
import { Component, ViewChild, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ConfirmComponent } from '../../components/popup/confirm/confirm.component';
import { Todo } from '../../models/todo';
import { DEFAULT_CURRENT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '../../constants';
import { TodoService } from '../../services/todo/todo.service';
import { TodoFormComponent } from '../../components/form/todo-form/todo-form.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TodoFormComponent,
    ConfirmComponent,
    PaginationComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  paginatedTodos: Todo[] = [];
  today: Date = new Date();
  showForm: boolean = false;
  currentTodo: Todo | null = null;
  searchTerm: string = '';
  startDateFilter: string = '';
  private routeSubscription!: Subscription;
  showConfirmDelete: boolean = false;
  todoToDelete: Todo | null = null;
  currentPage: number = DEFAULT_CURRENT_PAGE;

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['searchTerm'] || '';
      this.startDateFilter = params['startDate'] || '';
      this.currentPage = params['page'] || DEFAULT_CURRENT_PAGE;
      this.fetchTodos();
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  fetchTodos() {
    this.todoService.getTodos().subscribe({
      next: (data: Todo[]) => {
        this.todos = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to fetch todos', err);
      },
    });
  }

  addTodo(newTodo: Omit<Todo, 'id'>) {
    this.todoService.addTodo(newTodo).subscribe({
      next: () => {
        this.fetchTodos();
        this.toggleForm();
      },
      error: (err) => {
        console.error('Failed to add todo', err);
      },
    });
  }

  updateTodo(updatedTodo: Todo) {
    this.todoService.updateTodo(updatedTodo).subscribe({
      next: () => {
        this.fetchTodos();
        this.toggleForm();
      },
      error: (err) => {
        console.error('Failed to update todo', err);
      },
    });
  }

  deleteTodo(i: number) {
    this.todoToDelete = this.filteredTodos[i];
    this.showConfirmDelete = true;
  }

  confirmDelete() {
    if (this.todoToDelete) {
      this.todoService.deleteTodo(this.todoToDelete.id).subscribe({
        next: () => {
          this.fetchTodos();
          this.todoToDelete = null;
          this.showConfirmDelete = false;
        },
        error: (err) => {
          console.error('Failed to delete todo', err);
        },
      });
    }
  }

  cancelDelete() {
    this.showConfirmDelete = false;
    this.todoToDelete = null;
  }

  toggleComplete(todo: Todo) {
    this.todoService.toggleComplete(todo.id, !todo.completed).subscribe({
      next: (updatedTodo: Todo) => {
        todo.completed = updatedTodo.completed;
      },
      error: (err) => {
        console.error('Failed to toggle completion', err);
      },
    });
  }

  get paginatedItems() {
    const start = (this.currentPage - 1) * DEFAULT_ITEMS_PER_PAGE;
    const end = start + DEFAULT_ITEMS_PER_PAGE;
    return this.filteredTodos.slice(start, end);
  }

  applyFilters() {
    this.filteredTodos = this.todos.filter((todo) => {
      const matchesSearch = this.searchTerm
        ? todo.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesDate = this.startDateFilter
        ? new Date(todo.date).toISOString().split('T')[0] ===
          this.startDateFilter
        : true;

      return matchesSearch && matchesDate;
    });

    this.paginatedTodos = this.paginatedItems;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchTerm: this.searchTerm || null,
        startDate: this.startDateFilter || null,
        page: this.currentPage || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  applySearchFilters() {
    this.applyFilters();
  }

  clearDateFilter() {
    this.startDateFilter = '';
    this.applyFilters();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.currentTodo = null;
  }

  editTodo(index: number) {
    this.currentTodo = this.todos[index];
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.currentTodo = null;
  }

  
}
