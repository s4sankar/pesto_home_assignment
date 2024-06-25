import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setAccessToken(accessToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
  }

  getAccessToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  setLoggedIn(isLoggedIn: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', isLoggedIn);
    }
  }

  getLoggedIn() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn');
    }
    return null;
  }

  clearAll() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
}
