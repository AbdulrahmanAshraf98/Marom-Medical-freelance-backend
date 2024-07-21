import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TranslationService } from '../../service/translation/translation.service';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ApiResponse } from '../../interfaces/ApiResponse.interface';
import { ErrorProcessor } from '../utils/error-processor';
import { ResponseUtil } from '../../../util/response.util/response.util'; // Adjust import path accordingly

@Catch()
export class AllExceptionFilter<T> implements ExceptionFilter {
  constructor(private readonly translationService: TranslationService) {}

  async catch(exception: T, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const acceptHeader = request.headers['accept'];

    // Check if the request expects a JSON response
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw exception;
    }

    const response = ctx.getResponse<Response>();
    const locale: string = request.headers['accept-language'] || 'en';
    const status: number = ExceptionUtil.getStatus(exception);

    // Process the exception to extract relevant error data
    const errorProcessorResponse: object | null = ErrorProcessor.processException(exception);
    const messageKey: string = ErrorProcessor.processExceptionMessage(exception);
    const errorMessage: string = await this.translationService.translate(messageKey, locale);

    // Translate validation errors if they exist
    let translatedErrors = null;
    if (errorProcessorResponse && typeof errorProcessorResponse === 'object') {
      translatedErrors = await this.translateValidationErrors(errorProcessorResponse, locale);
    }

    // Create and send the error response
    const errorResponse: ApiResponse<any> = ResponseUtil.createErrorResponse(
      errorMessage,
      status,
      translatedErrors,
    );
    response.status(status).json(errorResponse);
  }

  private async translateValidationErrors(
    validationErrors: object,
    locale: string,
  ): Promise<object> {
    // Collect translation promises for both keys and values
    const translations = await Promise.all(
      Object.entries(validationErrors).map(async ([key, value]) => {
        try {
          // Translate the validation key and value
          const translatedKey = await this.translationService.translate(
            `validationKeys.${key}`,
            locale,
          );
          const translatedValue = await this.translationService.translate(
            `messages.${value}`,
            locale,
          );
          return { translatedKey, translatedValue };
        } catch (error) {
          // Handle translation errors if needed
          console.error(`Translation error for key: ${key}, value: ${value}`, error);
          return { translatedKey: key, translatedValue: value };
        }
      }),
    );

    // Build the result object with translated keys and values
    return translations.reduce(
      (acc, { translatedKey, translatedValue }) => {
        acc[translatedKey] = translatedValue;
        return acc;
      },
      {} as { [key: string]: string },
    );
  }
}
