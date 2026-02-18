import { computed, Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

interface LoginResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly TOKEN_KEY = 'todo_token';
  private readonly API_URL = 'http://localhost:3000/auth';

  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  isLoggedIn = computed(() => !!this._token());

  login(email: string, pass: string) {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { email, pass }).pipe(
      tap((response) => {
        this.saveToken(response.accessToken);
      }),
    );
  }

  private saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._token.set(token);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this._token.set(null);
  }

  get token() {
    return this._token();
  }
}
