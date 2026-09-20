import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as fs from 'fs';
import * as path from 'path';

let disposableDomains: Set<string> | null = null;

function loadDisposableDomains() {
  if (disposableDomains) return disposableDomains;
  try {
    const filePath = path.join(__dirname, 'disposable-domains.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const domains = JSON.parse(data);
    disposableDomains = new Set(domains.map((d: string) => d.toLowerCase()));
  } catch (err) {
    // Fallback if file not found
    disposableDomains = new Set(['mailinator.com', 'tempmail.com', '10minutemail.com', 'yopmail.com', 'guerrillamail.com']);
  }
  return disposableDomains;
}

@ValidatorConstraint({ async: false })
export class IsNotDisposableEmailConstraint implements ValidatorConstraintInterface {
  validate(email: any, args: ValidationArguments) {
    if (typeof email !== 'string') return false;
    
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const domain = parts[1].toLowerCase();
    const domains = loadDisposableDomains();
    
    return !domains.has(domain);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Disposable or temporary email addresses are not allowed.';
  }
}

export function IsNotDisposableEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotDisposableEmailConstraint,
    });
  };
}
