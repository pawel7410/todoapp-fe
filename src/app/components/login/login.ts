import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    this.errorMessage.set(null);

    if (this.loginForm.valid) {
      const { email, pass } = this.loginForm.getRawValue();
      this.authService.login(email!, pass!).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => {
          console.log('hmmm');

          if (err.status === 401) {
            this.errorMessage.set('Nieprawidłowy email lub hasło.');
          } else {
            this.errorMessage.set('Coś poszło nie tak. Spróbuj ponownie później.');
          }
        },
      });
    }
  }
}
