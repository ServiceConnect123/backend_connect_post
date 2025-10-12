import { ValueObject } from './value-object.base';

export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  protected validate(): void {
    if (!this.value || !Email.EMAIL_REGEX.test(this.value)) {
      throw new Error('Invalid email format');
    }
  }

  toString(): string {
    return this.value;
  }
}
