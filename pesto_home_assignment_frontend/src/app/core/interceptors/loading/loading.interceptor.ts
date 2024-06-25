import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../../services/loading/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('LoadingInterceptor');
  const loadingService = inject(LoadingService);
  loadingService.setLoading(true);
  return next(req).pipe(finalize (() => loadingService.setLoading(false)));
};
