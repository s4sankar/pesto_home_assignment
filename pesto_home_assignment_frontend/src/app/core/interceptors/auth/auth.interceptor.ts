import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { RefreshTokenModel } from '../../models/refresh-token.model';
import { AuthService } from '../../services/auth/auth.service';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('AuthInterceptor');
  let isRefreshing = false;
  let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  const authService = inject(AuthService);
  const localStorageService = inject(LocalStorageService);
  const accessToken = localStorageService.getAccessToken();
  const router = inject(Router);

  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(req).pipe(catchError(err => {
    if (err.status === 403) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
          switchMap((newToken: HttpResponse<RefreshTokenModel>) => {

            refreshTokenSubject.next(newToken.body?.accessToken);
            localStorageService.setAccessToken(newToken.body?.accessToken!);
            return next(req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken.body?.accessToken!}`
              }
            }));

          }), catchError((err) => {

            authService.logout().subscribe({
              next: (value) => {
                if (value.status === 204) {
                  localStorageService.clearAll();
                  localStorageService.setLoggedIn('0');
                  router.navigate(['/auth']);
                }
              },
              error: (err) => {

                return throwError(() => err);
              }
            });
            return throwError(() => err);
          }));

      } else {
        return refreshTokenSubject.pipe(
          filter(token => token != null),
          take(1),
          switchMap(accessToken => {
            return next(req.clone({
              setHeaders: {
                Authorization: `Bearer ${accessToken}`
              }
            }));
          }));
      }
    }
    return throwError(() => err);
  }));
};

