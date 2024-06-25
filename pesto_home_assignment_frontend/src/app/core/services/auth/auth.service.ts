import { Injectable } from '@angular/core';
import { BaseHttpService } from '../base-http.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { LoginModel } from '../../models/user.model';
import { RefreshTokenModel } from '../../models/refresh-token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  registerUser(fullName: string, email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'register', {
      'fullName': fullName,
      'email': email,
      'password': password,
    }).pipe(catchError(err => {
      return this.throwErrorResp(err);
    }));
  }

  loginUser(email: string, password: string): Observable<HttpResponse<LoginModel>> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response',
      withCredentials: true,
    };

    return this.httpClient.post<LoginModel>(this.baseUrl + 'login', {
      'email': email,
      'password': password,
    }, httpOptions).pipe(catchError(err => {
      return this.throwErrorResp(err);
    }));
  }

  refreshToken(): Observable<HttpResponse<RefreshTokenModel>> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response',
      withCredentials: true,
    };

    return this.httpClient.get<RefreshTokenModel>(this.baseUrl + 'refresh', httpOptions).pipe(
      catchError(err => {
        return this.throwErrorResp(err);
      }));
  }


  logout(): Observable<HttpResponse<any>> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response',
      withCredentials: true,
    };

    return this.httpClient.get<any>(this.baseUrl + 'logout', httpOptions).pipe(
      catchError(err => {
        return this.throwErrorResp(err);
      }));
  }
}
