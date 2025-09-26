import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

export function passwordStrengthValidator(
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
export function passwordMatchValidator(
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
