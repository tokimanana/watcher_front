import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || control.value.length === 0) {
      return null;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isValid = emailPattern.test(control.value);

    return isValid ? null : { invalidEmail: true };
  };
}

export function allowedEmailDomainsValidator(allowedDomains: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || control.value.length === 0) {
      return null;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(control.value)) {
      return null;
    }

    const domain = control.value.split('@')[1].toLowerCase();

    const isAllowed = allowedDomains.some(
      allowedDomain => domain === allowedDomain.toLowerCase()
    );

    return isAllowed ? null : {
      domainNotAllowed: {
        actualDomain: domain,
        allowedDomains: allowedDomains
      }
    };
  };
}
