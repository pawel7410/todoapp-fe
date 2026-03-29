import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TasksComponent } from './components/tasks/tasks';
import { AuthService } from './service/auth.service';
import { RouterOutlet } from '@angular/router';

export type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet],
})
export class AppComponent {
  public readonly authService = inject(AuthService);

  public logout() {
    this.authService.logout();
  }

  public deleteAccount() {
    if (!confirm('Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można cofnąć.')) return;
    this.authService.deleteAccount().subscribe();
  }
}
