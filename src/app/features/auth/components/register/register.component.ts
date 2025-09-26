import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { PasswordStrengthService } from '../../services/password-strength.service';
import { passwordMatchValidator } from '../../../../shared/validators/password-validator';
import { emailValidator } from '../../../../shared/validators/email-validator';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly passwordStrengthService = inject(PasswordStrengthService);

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, emailValidator]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        agreeToTerms: [false, [Validators.requiredTrue]],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit() {
    // Listen to password changes to update validation and strength indicator
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      // Force re-validation of the password field
      const passwordControl = this.registerForm.get('password');
      if (passwordControl) {
        passwordControl.updateValueAndValidity({
          onlySelf: false,
          emitEvent: false,
        });
      }

      // Also update confirm password validation when password changes
      const confirmPasswordControl = this.registerForm.get('confirmPassword');
      if (confirmPasswordControl?.touched || confirmPasswordControl?.dirty) {
        this.registerForm.updateValueAndValidity({
          onlySelf: false,
          emitEvent: false,
        });
      }
    });

    // Listen to confirm password changes
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      if (this.registerForm.get('confirmPassword')?.touched) {
        this.registerForm.updateValueAndValidity({
          onlySelf: false,
          emitEvent: false,
        });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update((value) => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update((value) => !value);
  }

  getPasswordStrength(): 'weak' | 'medium' | 'strong' {
    const password = this.registerForm.get('password')?.value;
    if (!password) return 'weak';

    return this.passwordStrengthService.getPasswordStrength(password);
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    return this.passwordStrengthService.getPasswordStrengthText(strength);
  }

  shouldShowPasswordError(): boolean {
    const passwordControl = this.registerForm.get('password');
    return !!(passwordControl?.invalid && passwordControl?.touched);
  }

  shouldShowConfirmPasswordError(): boolean {
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    const formHasMismatchError = this.registerForm.errors?.['passwordMismatch'];

    return !!(
      (confirmPasswordControl?.invalid && confirmPasswordControl?.touched) ||
      (formHasMismatchError && confirmPasswordControl?.touched)
    );
  }

  async onSubmit(): Promise<void> {
    this.registerForm.markAllAsTouched();

    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.updateValueAndValidity({ onlySelf: false });
    });

    this.registerForm.updateValueAndValidity();

    if (this.registerForm.invalid) {
      console.log('Form invalid, errors:', this.registerForm.errors);

      const firstInvalidField = Object.keys(this.registerForm.controls).find(
        (key) => this.registerForm.get(key)?.invalid
      );

      if (firstInvalidField) {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.focus();
        }
      }
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const { confirmPassword, agreeToTerms, ...userData } =
        this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (user) => {
          this.snackBar.open(
            `Welcome to Course Watcher, ${user.name}!`,
            'Close',
            {
              duration: 4000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            }
          );
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.errorMessage.set(
            error.message || 'Registration failed. Please try again.'
          );
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      this.errorMessage.set('An unexpected error occurred. Please try again.');
      this.isLoading.set(false);
    }
  }
}
