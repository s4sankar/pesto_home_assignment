import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { TaskDetail } from '../../../../core/models/task.model';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { LocalStorageService } from '../../../../core/services/localStorage/local-storage.service';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { AddTasksComponent } from '../add-tasks/add-tasks.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatToolbarModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatSelectModule,
    MatInputModule, MatFormFieldModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, MatMenuModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {

  pageSize = 10;
  totalCount = 0;
  pageIndex = 0;
  pageNumber = 1;
  filterEnabled = false;

  displayedColumns: string[] = ['sl no', 'title', 'description', 'status', 'action'];
  taskStatuses: string[] = ['Todo', 'InProgress', 'Done'];

  @ViewChild('paginator') paginator?: MatPaginator;
  dataSource: MatTableDataSource<TaskDetail> = new MatTableDataSource<TaskDetail>;

  constructor(private taskService: TasksService, private dialog: MatDialog, public loadingService: LoadingService,
    private snackBar: MatSnackBar, private authService: AuthService, private localStorageService: LocalStorageService,
    private router: Router) { }

  ngOnInit(): void {
    this.getTasks();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator || null;
  }

  getTasks() {
    this.taskService.getTasks(this.pageNumber, this.pageSize).subscribe({
      next: data => {
        if (data.tasks.length !== 0) {
          this.dataSource.data = data.tasks;
          this.totalCount = data.totalCount;
        } else {
          this.dataSource = new MatTableDataSource<TaskDetail>([]);
          this.dataSource.paginator = this.paginator || null;
        }
      },
      error: err => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 2000,
        });
      }
    });
  }

  loadPage(data: PageEvent) {
    this.pageIndex = data.pageIndex;
    this.pageSize = data.pageSize;
    this.pageNumber = this.pageIndex + 1;
    this.getTasks();
  }

  addTask() {
    const dialogRef = this.dialog.open(AddTasksComponent, {
      width: '350px',
      height: '450px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.getTasks();
      }
    });
  }

  updateTaskStatus(task: TaskDetail, status: string) {
    this.taskService.updateTaskStatus(task._id, status).subscribe({
      next: task => {
        if (task) {
          this.snackBar.open('Task status updated successfully', 'Close', {
            duration: 2000,
          });
          this.getTasks();
        }
      },
      error: err => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 2000,
        });
      }
    });
  }

  deleteTask(task: TaskDetail) {
    this.taskService.deleteTask(task._id).subscribe({
      next: task => {
        this.snackBar.open('Task deleted successfully', 'Close', {
          duration: 2000,
        });
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.getTasks();
      },
      error: err => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 2000,
        });
      }
    });
  }

  filterTasksByStatus(status: string): void {
    this.pageIndex = 0;
    this.pageNumber = 1;

    this.taskService.getFilteredTasks(status, this.pageNumber, this.pageSize).subscribe({
      next: data => {
        if (data.tasks.length !== 0) {
          this.filterEnabled = true;
          this.dataSource.data = data.tasks;
          this.totalCount = data.totalCount;
        } else {
          this.dataSource = new MatTableDataSource<TaskDetail>([]);
          this.dataSource.paginator = this.paginator || null;
        }
      },
      error: err => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 2000,
        });
      }
    });
  }

  resetFilter() {
    this.filterEnabled = false;
    this.pageIndex = 0;
    this.pageNumber = 1;
    this.getTasks();
  }

  logout() {
    this.authService.logout().subscribe({
      next: (value) => {
        if (value.status === 204) {
          this.localStorageService.clearAll();
          this.localStorageService.setLoggedIn('0');
          this.router.navigate(['/auth']);
        }
      },
      error: (err) => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 2000
        });
      }
    });
  }
}
