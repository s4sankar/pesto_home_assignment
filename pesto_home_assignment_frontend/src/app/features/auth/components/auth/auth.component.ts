import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { LocalStorageService } from '../../../../core/services/localStorage/local-storage.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {

  isLogin: boolean = true;
  loginFormGroup?: FormGroup;
  registerFormGroup?: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar,
    private localStorageService: LocalStorageService, public loadingService: LoadingService) {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]]
    });

    this.registerFormGroup = fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.minLength(8), Validators.required]],
    });
  }

  login() {
    this.authService.loginUser(this.loginFormGroup?.value.email, this.loginFormGroup?.value.password).subscribe({
      next: user => {
        if (user) {
          this.localStorageService.setLoggedIn('1');
          this.localStorageService.setAccessToken(user.body?.accessToken!);
          this.router.navigate(['/home']);
        }
      }, error: err => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 2000
        });
      }
    });
  }

  register() {
    if (this.registerFormGroup?.value.password !== this.registerFormGroup?.value.confirmPassword) {
      this.snackBar.open('Passwords do not match', 'Close', {
        duration: 2000
      });
      return;
    }
    this.authService.registerUser(this.registerFormGroup?.value.fullName, this.registerFormGroup?.value.email, this.registerFormGroup?.value.password).subscribe({
      next: user => {
        this.toggleAuth();
        this.registerFormGroup?.reset();
        this.snackBar.open('User registered successfully. Login to continue.', 'Close', {
          duration: 2000
        });
      }, error: err => {
        this.snackBar.open(err.error.message, 'Close', {
          duration: 2000
        });
      }
    });
  }

  toggleAuth() {
    this.isLogin = !this.isLogin;
  }
}
