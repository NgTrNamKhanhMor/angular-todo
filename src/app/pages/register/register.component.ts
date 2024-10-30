import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  register() {
    if (this.password === this.confirmPassword) {
      // Dummy registration logic, normally you'd call an API to register the user
      console.log('User registered:', this.email);
      this.router.navigate(['/login']); // Redirect to login page after successful registration
    } else {
      this.errorMessage = 'Passwords do not match';
    }
  }
}