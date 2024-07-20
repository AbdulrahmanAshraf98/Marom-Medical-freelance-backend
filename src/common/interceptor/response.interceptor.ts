import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/ApiResponse.interface';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { MESSAGE_KEY } from '../decorators/response-message.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly i18nService: I18nService,
    private readonly reflector: Reflector,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const messageKey =
      this.reflector.get<string>(MESSAGE_KEY, handler) ||
      'messages.success_fetch';
    const locale: string =
      context.switchToHttp().getRequest().headers['accept-language'] || 'en';
    return next.handle().pipe(
      map(async (data) => {
        const message = await this.i18nService.translate(messageKey, {
          lang: locale,
        });
        if (typeof data === 'object' && data !== null) {
          return {
            message,
            status: 200,
            data,
          } as ApiResponse<typeof data>;
        }
        return data;
      }),
    );
  }
}
