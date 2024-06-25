import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from '../base-http.service';
import { Observable, catchError } from 'rxjs';
import { TaskDetail, TaskModel } from '../../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService extends BaseHttpService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  addTask(title: string, description: string, status: string): Observable<TaskDetail> {
    return this.httpClient.post<TaskDetail>(this.baseUrl + 'add-task', {
      'title': title,
      'description': description,
      'status': status,
    }).pipe(
      catchError(err => {
        return this.throwErrorResp(err);
      })
    );
  }

  getTasks(pageNumber: number, pageSize: number): Observable<TaskModel> {
    return this.httpClient.post<TaskModel>(this.baseUrl + 'get-tasks', {
      'pageNumber': pageNumber,
      'pageSize': pageSize,
    }).pipe(
      catchError(err => {
        return this.throwErrorResp(err);
      })
    );
  }

  getFilteredTasks(status: string, pageNumber: number, pageSize: number): Observable<TaskModel> {
    return this.httpClient.post<TaskModel>(this.baseUrl + 'get-filtered-tasks', {
      'status': status,
      'pageNumber': pageNumber,
      'pageSize': pageSize,
    }).pipe(
      catchError(err => {
        return this.throwErrorResp(err);
      })
    );
  }

  updateTaskStatus(id: string, status: string): Observable<TaskDetail> {
    return this.httpClient.patch<TaskDetail>(this.baseUrl + `update-task/${id}`, {
      'status': status,
    }).pipe(
      catchError(err => {
        return this.throwErrorResp(err);
      })
    );
  }

  deleteTask(id: string): Observable<TaskDetail> {
    return this.httpClient.delete<TaskDetail>(this.baseUrl + `delete-task/${id}`).pipe(
      catchError(err => {
        return this.throwErrorResp(err);
      })
    );
  }
}
