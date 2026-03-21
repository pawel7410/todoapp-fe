import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FilterType } from '../../app';
import { AuthService } from '../../service/auth.service';

interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-tasks',
  imports: [],
  standalone: true,
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks';
  private authService = inject(AuthService);

  tasks = signal<Task[]>([]);

  readonly filter = signal<FilterType>('all');

  readonly filteredTasks = computed(() => {
    const tasks = this.tasks();
    const filter = this.filter();

    if (filter === 'active') {
      return tasks.filter((t) => !t.isCompleted);
    } else if (filter === 'completed') {
      return tasks.filter((t) => t.isCompleted);
    }
    return tasks;
  });

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => this.tasks.set(tasks),
      error: (err) => console.error('Error fetching tasks:', err),
    });
  }

  addTask(title: string) {
    if (!title.trim()) return;

    // Pamiętaj: authorId: 1 to ID użytkownika, którego stworzyłeś w Prisma Studio
    const newTask = { title, isCompleted: false };

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

  updateStatus(task: Task) {
    this.http
      .patch<Task>(`${this.apiUrl}/${task.id}/status`, { isCompleted: !task.isCompleted })
      .subscribe((updatedTask) => {
        this.tasks.update((currentTasks) => {
          return currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
        });
      });
  }
}
