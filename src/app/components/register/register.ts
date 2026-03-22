import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: [''], // Opcjonalne, zależnie od Twojego modelu Prisma
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Rejestracja udana! Możesz się zalogować.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = 'Błąd rejestracji. Możliwe, że email jest już zajęty.';
          console.error(err);
        },
      });
    }
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }
}
