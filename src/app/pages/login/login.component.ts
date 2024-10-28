import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services/auth/auth.service';
import { EmailValidatorDirective } from 'app/directives/email-validator.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, EmailValidatorDirective],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  submitted = false;
  loading = false;
  @ViewChild('myForm') form!: NgForm;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.submitted = true;
    this.loading = true;

    if (this.form.valid) {
      this.authService.login(this.form.value.email, this.form.value.password).subscribe({
        next: () => {
          this.router.navigate(['/todo-list']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage = 'Login failed. Please check your credentials.';
        },
        complete: () => {
          this.loading = false; 
        },
      });
    } else {
      this.loading = false; 
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}
