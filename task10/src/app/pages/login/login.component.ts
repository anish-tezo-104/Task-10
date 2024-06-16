import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';
import { ErrorCodes } from '../../enums/error-codes';
import { SuccessCodes } from '../../enums/success-codes';



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


  constructor(private router: Router, private toast: ToasterService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    })

  }

  OnLogin(): void {
    if (this.loginForm.valid) {
      const loggingToastId : any = this.toast.showDefaultToaster("Logging...")
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (res) => {
          localStorage.setItem('authUser', JSON.stringify(res.authResponse));
          localStorage.setItem('authToken', res.token);
          this.toast.removeToaster(loggingToastId);
        },
        error: (err) => {
          this.toast.showErrorToaster(err);
          this.loginForm.reset();
        },
        complete: () => {
          this.toast.showSuccessToaster(SuccessCodes.LOGIN_SUCCESS)
          this.router.navigateByUrl('/Dashboard');
          this.loginForm.reset();
        }
      });
    } else {
      this.toast.showErrorToaster(ErrorCodes.INVALID_CREDENTIALS);
    }
  }
}
