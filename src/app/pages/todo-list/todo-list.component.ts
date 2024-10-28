import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TodoFormComponent } from '@components/form/todo-form/todo-form.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { ConfirmComponent } from '@components/popup/confirm/confirm.component';
import { DEFAULT_CURRENT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '@constants/index';
import { Todo } from '@models/todo';
import { User } from '@models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { TodoService } from '@services/todo/todo.service';

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
  loading: boolean = false;

  private modalService = inject(NgbModal);
  constructor(
    private authService: AuthService,
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
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  fetchTodos() {
    this.loading = true;
    this.todoService.getTodos().subscribe({
      next: (data: Todo[]) => {
        this.todos = data.filter(
          (todo) => todo.userId === Number(this.currentUser!.id)
        );
        this.applyFilters();
        this.loading = false;
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

  deleteTodo(i: number) {
    this.todoToDelete = this.filteredTodos[i];
    this.openDelete();
  }

  confirmDelete() {
    if (this.todoToDelete) {
      this.todoService.deleteTodo(this.todoToDelete.id).subscribe({
        next: () => {
          this.fetchTodos();
          this.todoToDelete = null;
          this.cancelDelete();
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
      this.openForm();
    } else {
      console.error(`Todo with id ${id} not found`);
    }
  }

  openForm() {
    const modalRef = this.modalService.open(TodoFormComponent);
    modalRef.componentInstance.currentTodo = this.currentTodo;

    modalRef.componentInstance.addTodoEvent.subscribe((todo: Todo) => {
      this.addTodo(todo);
    });

    modalRef.componentInstance.editTodoEvent.subscribe((todo: Todo) => {
      this.updateTodo(todo);
    });

    modalRef.componentInstance.cancelEvent.subscribe(() => {
      this.cancelForm();
    });
  }

  cancelForm() {
    this.currentTodo = null;
  }

  openDelete() {
    const modalRef = this.modalService.open(ConfirmComponent);
    modalRef.componentInstance.todoName = this.todoToDelete?.name;

    modalRef.componentInstance.confirmDelete.subscribe(() => {
      this.confirmDelete();
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      this.cancelDelete();
    });
  }

  cancelDelete() {
    this.todoToDelete = null;
  }

  logout() {
    this.authService.logout();
  }
}
