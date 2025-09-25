import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  emailSent = signal(false);
  sentToEmail = signal<string>('');

  forgotForm: FormGroup;

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const email = this.forgotForm.value.email;

      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.emailSent.set(true);
          this.sentToEmail.set(email);
          this.snackBar.open('Password reset email sent successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Failed to send reset email. Please try again.');
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      this.errorMessage.set('An unexpected error occurred. Please try again.');
      this.isLoading.set(false);
    }
  }

  async resendEmail(): Promise<void> {
    const email = this.sentToEmail();
    if (!email) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.snackBar.open('Reset email sent again', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Failed to resend email. Please try again.');
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    } catch (error) {
      console.error('Resend email error:', error);
      this.errorMessage.set('An unexpected error occurred. Please try again.');
      this.isLoading.set(false);
    }
  }
}
