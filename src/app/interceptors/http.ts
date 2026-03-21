import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(cloned).pipe(
    catchError((err) => {
      if (err.status === 401) {
        authService.logout();
      }
      return throwError(() => err);
    }),
  );
};
