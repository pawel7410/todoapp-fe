import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FilterType } from '../../app';
import { AuthService } from '../../service/auth.service';
import { environment } from '../../../environments/environment.development';
import { DragDropModule, moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-tasks',
  imports: [DragDropModule],
  standalone: true,
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent implements OnInit {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/tasks';
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

    const newTask = { title, isCompleted: false };

    this.http.post(this.apiUrl, newTask).subscribe((savedTask: any) => {
      this.tasks.update((currentTasks) => [...currentTasks, savedTask]);
    });
  }

  deleteTask(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
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

  drop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks(), event.previousIndex, event.currentIndex);

    const reorderedIds = this.tasks().map((t) => t.id);

    this.http.patch(`${this.apiUrl}/reorder`, reorderedIds).subscribe({
      error: (err) => {
        console.error('reorder error', err);
      },
    });
  }
}
