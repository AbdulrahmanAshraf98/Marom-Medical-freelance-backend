import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ApiResponse } from '../../interfaces/ApiResponse.interface';
import { Reflector } from '@nestjs/core';
import { TranslationService } from '../../service/translation/translation.service';
import { MESSAGE_KEY } from '../../decorators/response-message/response-message.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly translationService: TranslationService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const messageKey: string =
      this.reflector.get<string>(MESSAGE_KEY, handler) ||
      'messages.success_fetch';
    const locale: string =
      context.switchToHttp().getRequest().headers['accept-language'] || 'en';
    return next.handle().pipe(
      mergeMap(async (data): Promise<any> => {
        const message: string = await this.translationService.translate(
          messageKey,
          locale,
        );

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
