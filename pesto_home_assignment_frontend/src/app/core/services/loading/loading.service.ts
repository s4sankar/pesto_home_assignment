import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public loading$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  setLoading(isLoading: boolean) {
    this.loading$.next(isLoading);
  }
}
