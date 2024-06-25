import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TasksService } from '../../../../core/services/tasks/tasks.service';


@Component({
  selector: 'app-add-tasks',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, CommonModule, MatSnackBarModule],
  templateUrl: './add-tasks.component.html',
  styleUrl: './add-tasks.component.scss'
})
export class AddTasksComponent {

  tasksFormGroup!: FormGroup;
  statuses = ['Todo', 'InProgress', 'Done'];

  constructor(private fb: FormBuilder, private taskService: TasksService, private matDialogRef: MatDialogRef<AddTasksComponent>,
    private snackBar: MatSnackBar,) {
    this.tasksFormGroup = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      status: [this.statuses[0], [Validators.required]]
    });
  }

  addTask() {
    this.taskService.addTask(
      this.tasksFormGroup.value.title,
      this.tasksFormGroup.value.description,
      this.tasksFormGroup.value.status
    ).subscribe({
      next: task => {
        this.matDialogRef.close(true);
      },
      error: err => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 2000
        });
      }
    });
  }

  closeDialog() {
    this.matDialogRef.close();
  }
}
