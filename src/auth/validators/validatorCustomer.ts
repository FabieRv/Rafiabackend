import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsLowercaseEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLowercaseEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && value === value.toLowerCase();
        },
        defaultMessage(args: ValidationArguments) {
          return 'L’email doit être en minuscules uniquement';
        },
      },
    });
  };
}
