import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'tasks',
    loadComponent: () => import('./components/tasks/tasks').then((m) => m.TasksComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: '**', redirectTo: 'tasks' },
];
