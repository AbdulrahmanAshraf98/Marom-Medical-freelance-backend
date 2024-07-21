import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { TranslationService } from '../../service/translation/translation.service';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let translationService: TranslationService;
  let reflector: Reflector;
  let context: ExecutionContext;
  let next: CallHandler;

  const setupMocks = (locale: string, translation: string) => {
    context.switchToHttp().getRequest = jest.fn().mockReturnValue({
      headers: {
        'accept-language': locale,
      },
    });
    translationService.translate = jest.fn().mockResolvedValue(translation);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseInterceptor,
        {
          provide: TranslationService,
          useValue: {
            translate: jest.fn().mockResolvedValue('translated_message'),
          },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn().mockReturnValue('messages.success_fetch'),
          },
        },
      ],
    }).compile();

    interceptor = module.get<ResponseInterceptor>(ResponseInterceptor);
    translationService = module.get<TranslationService>(TranslationService);
    reflector = module.get<Reflector>(Reflector);

    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            'accept-language': 'en',
          },
        }),
      }),
      getHandler: jest.fn(),
    } as any;

    next = {
      handle: jest.fn().mockReturnValue(of({ data: 'test' })),
    };
  });

  const testInterceptor = async (
    data: any,
    expectedResult: any,
    locale: string,
    translation: string,
  ) => {
    setupMocks(locale, translation);
    next.handle = jest.fn().mockReturnValue(of(data));
    const result = await interceptor.intercept(context, next).toPromise();
    expect(reflector.get).toHaveBeenCalledWith(
      'response_message',
      context.getHandler(),
    );
    expect(translationService.translate).toHaveBeenCalledWith(
      'messages.success_fetch',
      locale,
    );
    expect(result).toEqual(expectedResult);
  };

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should translate the message key and return formatted response', async () => {
    await testInterceptor(
      { data: 'test' },
      {
        message: 'translated_message',
        status: 200,
        data: { data: 'test' },
      },
      'en',
      'translated_message',
    );
  });

  it('should use default message key if no custom key is set', async () => {
    reflector.get = jest.fn().mockReturnValue(undefined);
    await testInterceptor(
      { data: 'test' },
      {
        message: 'translated_message',
        status: 200,
        data: { data: 'test' },
      },
      'en',
      'translated_message',
    );
  });

  it('should handle transforming data object', async () => {
    await testInterceptor(
      { name: 'John', age: 30 },
      {
        message: 'translated_message',
        status: 200,
        data: { name: 'John', age: 30 },
      },
      'en',
      'translated_message',
    );
  });

  it('should handle non-transforming data', async () => {
    await testInterceptor(
      'simple string response',
      'simple string response',
      'en',
      'translated_message',
    );
  });

  it('should translate message to Arabic', async () => {
    await testInterceptor(
      { data: 'test' },
      {
        message: 'رسالة مترجمة',
        status: 200,
        data: { data: 'test' },
      },
      'ar',
      'رسالة مترجمة',
    );
  });

  it('should return correct message in all languages', async () => {
    const languages = ['en', 'ar'];
    const messages = {
      en: 'Hello',
      ar: 'مرحبا',
    };

    for (const lang of languages) {
      await testInterceptor(
        { data: 'test' },
        {
          message: messages[lang],
          status: 200,
          data: { data: 'test' },
        },
        lang,
        messages[lang],
      );
    }
  });
});
