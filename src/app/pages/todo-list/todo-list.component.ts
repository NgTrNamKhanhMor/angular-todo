import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TodoFormComponent } from '@components/form/todo-form/todo-form.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { ConfirmComponent } from '@components/popup/confirm/confirm.component';
import { DEFAULT_CURRENT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '@constants/index';
import { Todo } from '@models/todo';
import { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';
import { TodoService } from '@services/todo/todo.service';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    PaginationComponent,
    FormsModule,
    TodoFormComponent,
    ConfirmComponent,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  todos: Todo[] = [];
  currentUser: User | null = null;
  filteredTodos: Todo[] = [];
  paginatedTodos: Todo[] = [];
  today: Date = new Date();
  currentTodo: Todo | null = null;
  searchTerm: string = '';
  startDateFilter: string = '';
  private routeSubscription!: Subscription;
  todoToDelete: Todo | null = null;
  currentPage: number = DEFAULT_CURRENT_PAGE;
  loading = signal<boolean>(false);

  private dialog = inject(MatDialog);

  constructor(
    private authService: AuthService,
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router,
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.setLocale('en-US');
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['searchTerm'] || '';
      this.startDateFilter = params['startDate'] || '';
      this.currentPage = params['page'] || DEFAULT_CURRENT_PAGE;
      this.fetchTodos();
    });
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnChanges() {}

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  fetchTodos() {
    this.loading.set(true);
    this.todoService.getTodos().subscribe({
      next: (data: Todo[]) => {
        this.todos = data.filter(
          (todo) => todo.userId === Number(this.currentUser!.id)
        );
        this.applyFilters();
        this.loading.set(false);
        console.log(this.loading);
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
      },
      error: (err) => {
        console.error('Failed to update todo', err);
      },
    });
  }

  deleteTodo(id: string) {
    this.todoToDelete = this.todos.find((todo) => todo.id === id) || null;
    if (this.todoToDelete) {
      this.openDelete();
    } else {
      console.error(`Todo with id ${id} not found`);
    }
  }

  confirmDelete() {
    if (this.todoToDelete) {
      this.todoService.deleteTodo(this.todoToDelete.id).subscribe({
        next: () => {
          this.fetchTodos();
          this.todoToDelete = null;
        },
        error: (err) => {
          console.error('Failed to delete todo', err);
        },
      });
    }
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

  onDateChange(event: any) {
    const selectedDate = event.value;
    this.startDateFilter = selectedDate
      ? selectedDate.toISOString().split('T')[0]
      : '';
    this.applyFilters();
  }

  applySearchFilters() {
    this.applyFilters();
  }

  clearDateFilter() {
    this.startDateFilter = '';
    this.applyFilters();
  }
  editTodo(id: string) {
    this.currentTodo = this.todos.find((todo) => todo.id === id) || null;

    if (this.currentTodo) {
      this.openForm(this.currentTodo);
    } else {
      console.error(`Todo with id ${id} not found`);
    }
  }

  openForm(currentTodo?: Todo) {
    this.dialog.open(TodoFormComponent, {
      data: {
        currentTodo,
        addTodoEvent: (todo: Todo) => this.addTodo(todo),
        editTodoEvent: (todo: Todo) => this.updateTodo(todo),
      },
    });
  }
  openDelete() {
    this.dialog.open(ConfirmComponent, {
      data: {
        todoName: this.todoToDelete?.name,
        confirmDelete: () => this.confirmDelete(),
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
