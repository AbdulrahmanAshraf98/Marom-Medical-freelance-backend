// src/common/interceptors/response.interceptor.spec.ts
import { ResponseInterceptor } from './response.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { ApiResponse } from '../interfaces/ApiResponse.interface';
import { of } from 'rxjs';
import DoneCallback = jest.DoneCallback;

type MockExecutionContext = jest.Mocked<ExecutionContext>;
type MockCallHandler = jest.Mocked<CallHandler>;
describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform Json response', (done: DoneCallback) => {
    const context: MockExecutionContext = mock<ExecutionContext>();
    const next: MockCallHandler = mock<CallHandler>();
    const exceptedResponse: ApiResponse<{ data: string }> = {
      message: 'success',
      status: 200,
      data: {
        data: 'test',
      },
    };
    next.handle.mockReturnValue(of({ data: 'test' }));
    interceptor.intercept(context, next).subscribe((data) => {
      expect(data).toEqual(exceptedResponse);
      done();
    });
  });
  it('should not transform non-JSON response', (done: DoneCallback) => {
    const context: MockExecutionContext = mock<ExecutionContext>();
    const next: MockCallHandler = mock<CallHandler>();
    const exceptedReturn: string = 'test';
    next.handle.mockReturnValue(of('test'));
    interceptor.intercept(context, next).subscribe((data) => {
      expect(data).toEqual(exceptedReturn);
      done();
    });
  });
});
