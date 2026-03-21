import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'todo_token';
  private _token = signal<string | null>(this.getInitialToken());
  private apiUrl = environment.apiUrl;

  isLoggedIn = computed(() => !!this._token());
  private router = inject(Router);

  login(email: string, pass: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, pass }).pipe(
      tap((response) => {
        this.saveToken(response.access_token);
        this._token.set(response.access_token);
      }),
    );
  }

  private saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._token.set(token);
  }

  private getInitialToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('get initial token', token);

    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  }

  logout() {
    console.log('logout');

    localStorage.removeItem(this.TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  get token() {
    return this._token();
  }
}
