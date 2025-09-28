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

  // Local signals
  emailSent = signal(false);
  sentToEmail = signal<string>('');

  // Auth service signals
  readonly isLoading = this.authService.isLoading;
  readonly error = this.authService.error;

  forgotForm: FormGroup;

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Getter pour l'erreur à afficher dans le template
  errorMessage(): string | null {
    return this.error();
  }

  async onSubmit(): Promise<void> {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    try {
      const email = this.forgotForm.value.email;

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.emailSent.set(true);
          this.sentToEmail.set(email);
        },
        error: (error) => {
          console.error('Forgot password failed:', error);
        },
      });
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
