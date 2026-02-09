import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks';

  tasks = signal<any[]>([]);

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => this.tasks.set(data));
  }

  addTask(title: string) {
    if (!title.trim()) return;

    // Pamiętaj: authorId: 1 to ID użytkownika, którego stworzyłeś w Prisma Studio
    const newTask = { title, authorId: 1, isCompleted: false };

    this.http.post(this.apiUrl, newTask).subscribe((savedTask: any) => {
      // Aktualizujemy sygnał (dodajemy nowe zadanie do listy bez przeładowania strony)
      this.tasks.update((currentTasks) => [...currentTasks, savedTask]);
    });
  }

  deleteTask(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      // Usuwamy zadanie z sygnału po udanym DELETE na backendzie
      this.tasks.update((currentTasks) => currentTasks.filter((t) => t.id !== id));
    });
  }
}
