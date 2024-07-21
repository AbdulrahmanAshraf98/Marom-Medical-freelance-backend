import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionUtil } from './exception.util';
import { ValidationError } from 'class-validator';

describe('ExceptionUtil', () => {
  describe('getStatus', () => {
    it('should return the status from HttpException', () => {
      const exception = new HttpException('Error', HttpStatus.BAD_REQUEST);
      expect(ExceptionUtil.getStatus(exception)).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return INTERNAL_SERVER_ERROR if not an HttpException', () => {
      expect(ExceptionUtil.getStatus('non-exception')).toBe(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('processException', () => {
    it('should process validation errors correctly', () => {
      const validationErrors: ValidationError[] = [
        {
          property: 'username',
          constraints: { isNotEmpty: 'Username should not be empty' },
        },
        {
          property: 'password',
          constraints: { minLength: 'Password is too short' },
        },
      ] as unknown as ValidationError[];

      const exception = new HttpException(
        validationErrors,
        HttpStatus.BAD_REQUEST,
      );
      const processed = ExceptionUtil.processException(exception);

      expect(processed).toEqual({
        message: 'Username should not be empty',
        data: {
          username: 'Username should not be empty',
          password: 'Password is too short',
        },
      });
    });

    it('should return null for non-validation exceptions', () => {
      const exception = new HttpException('Error', HttpStatus.BAD_REQUEST);
      expect(ExceptionUtil.processException(exception)).toBeNull();
    });
  });

  describe('processExceptionMessage', () => {
    it('should get the first validation error message', () => {
      const validationErrors: ValidationError[] = [
        {
          property: 'username',
          constraints: { isNotEmpty: 'Username should not be empty' },
        },
      ] as unknown as ValidationError[];

      const exception = new HttpException(
        validationErrors,
        HttpStatus.BAD_REQUEST,
      );
      expect(ExceptionUtil.processExceptionMessage(exception)).toBe(
        'Username should not be empty',
      );
    });

    it('should return the exception message for other HttpExceptions', () => {
      const exception = new HttpException(
        'Error message',
        HttpStatus.BAD_REQUEST,
      );
      expect(ExceptionUtil.processExceptionMessage(exception)).toBe(
        'Error message',
      );
    });

    it('should return "Unknown error" for non-exception arrays', () => {
      expect(ExceptionUtil.processExceptionMessage([])).toBe('Unknown error');
    });
  });
});
