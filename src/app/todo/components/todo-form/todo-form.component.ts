import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'app/auth/services/auth.service';
import { Todo } from 'app/todo/types/todo';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
})
export class TodoFormComponent {
  currentUserId: number = 0;
  todoForm: FormGroup;
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      currentTodo: Todo;
      addTodoEvent: (todo: Todo) => void;
      editTodoEvent: (todo: Todo) => void;
    },
    private dialogRef: MatDialogRef<TodoFormComponent>,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.todoForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  get name() {
    return this.todoForm.get('name');
  }

  get date() {
    return this.todoForm.get('date');
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = Number(user.id);
    }
    if (this.data.currentTodo) {
      this.populateForm();
    }
  }

  onSubmit() {
    if (this.todoForm.valid) {
      this.loading = true;
      if (this.data.currentTodo) {
        this.data.editTodoEvent({
          id: this.data.currentTodo.id,
          ...this.todoForm.value,
        });
      } else {
        this.data.addTodoEvent(this.todoForm.value);
      }
      this.dialogRef.close();
    }
  }

  private populateForm() {
    this.todoForm.patchValue({
      name: this.data.currentTodo?.name,
      date: this.data.currentTodo?.date,
    });
  }
}
