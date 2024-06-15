import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);

  constructor(private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    })

  }

  OnLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (res) => {
          console.log(res.token);
            localStorage.setItem('authUser', res.authResponse);
            localStorage.setItem('authToken', res.token);
            this.router.navigateByUrl('/Dashboard');
        },
        error: (err) => {
          // Handle error in login
          console.error('Login error', err);
          this.loginForm.reset();
        },
        complete: () => {
          this.loginForm.reset();
          console.log('Login request completed');
        }
      });
    }
  }
}
