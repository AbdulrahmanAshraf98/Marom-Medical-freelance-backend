import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ExceptionUtil {
  static getStatus(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  static processException(exception: any): object | null {
    if (
      exception instanceof HttpException &&
      Array.isArray(exception.getResponse())
    ) {
      const validationErrors = exception.getResponse() as ValidationError[];
      return this.processValidationErrors(validationErrors);
    }
    return null;
  }

  public static processExceptionMessage(exception: any): string {
    let message: string = 'Unknown Error';
    if (exception instanceof HttpException) {
      if (Array.isArray(exception.getResponse())) {
        message = this.getFirstValidationMessage(
          exception.getResponse() as ValidationError[],
        );
      } else {
        message = exception.message;
      }
    } else if (Array.isArray(exception)) {
      message = this.getFirstArrayExceptionMessage(exception);
    }
    return message;
  }

  private static processValidationErrors(errors: ValidationError[]): object {
    const validationErrors = errors.reduce(
      (acc: object, error: ValidationError): object => {
        acc[error.property] = error.constraints
          ? Object.values(error.constraints).join(',')
          : '';
        return acc;
      },
      {},
    );
    const firstError =
      errors.length > 0 ? Object.values(errors[0].constraints)[0] : '';
    return {
      message: firstError,
      data: validationErrors,
    };
  }

  private static getFirstValidationMessage(errors: ValidationError[]): string {
    return errors.length > 0 ? Object.values(errors[0].constraints)[0] : '';
  }

  private static getFirstArrayExceptionMessage(exception: any[]): string {
    return exception.length > 0 ? exception[0] : 'Unknown error';
  }
}
