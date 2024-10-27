import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Todo } from '../../../models/todo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css'
})
export class TodoFormComponent {
  id: string = '';
  completed: boolean = false;
  currentUserId: number = 0;
  loading: boolean = false;  
  @ViewChild('myForm') form!: NgForm;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = Number(user.id);
    }
  }

  @Input() currentTodo: Todo | null = null;
  @Output() addTodoEvent = new EventEmitter<Todo>();
  @Output() editTodoEvent = new EventEmitter<Todo>();
  @Output() cancelEvent = new EventEmitter<void>();

  ngOnChanges() {
    console.log('Loading state:', this.loading);
    this.populateForm();
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true; 
      setTimeout(() => {
        if (this.currentTodo) {
          this.editTodo();
        } else {
          this.addTodo();
        }
        this.loading = false;
      }, 1000);
    }
  }

  private populateForm() {
    if (this.currentTodo) {
      this.id = this.currentTodo.id;
      this.completed = this.currentTodo.completed;
      setTimeout(() => {
        const date = new Date(this.currentTodo!.date);
        const formattedDate = date.toISOString().split('T')[0];
        this.form.setValue({
          name: this.currentTodo!.name,
          date: formattedDate,
        });
      });
    }
  }

  addTodo() {
    this.addTodoEvent.emit({
      id: this.id,
      name: this.form.form.value.name.trim(),
      date: this.form.form.value.date,
      completed: false,
      userId: this.currentUserId,
    });
    this.loading = false; 
  }

  editTodo() {
    this.editTodoEvent.emit({
      id: this.id,
      name: this.form.form.value.name.trim(),
      date: this.form.form.value.date,
      completed: this.completed,
      userId: this.currentUserId,
    });
    this.loading = false; 
  }

  cancel() {
    this.cancelEvent.emit();
    this.loading = false; 
  }
}