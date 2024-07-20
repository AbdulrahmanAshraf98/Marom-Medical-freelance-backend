import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/ApiResponse.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data): ApiResponse<any> => {
        if (typeof data === 'object' && data !== null) {
          return {
            message: 'success',
            status: 200,
            data,
          } as ApiResponse<typeof data>;
        }
        return data;
      }),
    );
  }
}
