import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

function passwordStrengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  // Don't validate empty values
  if (!value || value.length === 0) {
    return null;
  }

  const errors: ValidationErrors = {};

  // Check minimum length
  if (value.length < 8) {
    errors['minlength'] = { requiredLength: 8, actualLength: value.length };
  }

  // Check character requirements
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumeric = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  if (!hasUpperCase || !hasLowerCase || !hasNumeric || !hasSpecialChar) {
    errors['pattern'] = true;
  }

  // Return null if no errors (valid), otherwise return errors object
  return Object.keys(errors).length > 0 ? errors : null;
}

// Improved password match validator
function passwordMatchValidator(
  form: AbstractControl
): ValidationErrors | null {
  if (!(form instanceof FormGroup)) return null;

  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  // Only validate if both fields have values
  if (password.value && confirmPassword.value) {
    if (password.value !== confirmPassword.value) {
      // Set error on confirmPassword control
      confirmPassword.setErrors({
        ...confirmPassword.errors,
        passwordMismatch: true,
      });
      return { passwordMismatch: true };
    } else {
      // Clear passwordMismatch error if passwords match
      if (confirmPassword.errors?.['passwordMismatch']) {
        const { passwordMismatch, ...otherErrors } = confirmPassword.errors;
        const hasOtherErrors = Object.keys(otherErrors).length > 0;
        confirmPassword.setErrors(hasOtherErrors ? otherErrors : null);
      }
    }
  }

  return null;
}

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

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            passwordStrengthValidator,
          ],
        ],
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

    let score = 0;

    // Length checks
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 3) return 'weak';
    if (score <= 5) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak':
        return 'Weak password';
      case 'medium':
        return 'Good password';
      case 'strong':
        return 'Strong password';
      default:
        return '';
    }
  }

  // Improved error display methods
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
    // Mark all fields as touched to show validation errors
    this.registerForm.markAllAsTouched();

    // Update validity for all controls
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.updateValueAndValidity({ onlySelf: false });
    });

    this.registerForm.updateValueAndValidity();

    if (this.registerForm.invalid) {
      console.log('Form invalid, errors:', this.registerForm.errors);

      // Find first invalid field and focus it
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
