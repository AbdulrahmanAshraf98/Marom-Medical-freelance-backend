import { Test, TestingModule } from '@nestjs/testing';
import { TranslationService } from './translation.service';
import { I18nService } from 'nestjs-i18n';

describe('TranslationService', () => {
  let service: TranslationService;
  let i18nService: I18nService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationService,
        {
          provide: I18nService,
          useValue: {
            translate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TranslationService>(TranslationService);
    i18nService = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('translate', () => {
    it('should return translate message', async () => {
      const key: string = 'messages.success_fetch';
      const locale: string = 'en';
      const expectedMessage = 'Translated Message';
      (i18nService.translate as jest.Mock).mockResolvedValue(expectedMessage);
      const result: string = await service.translate(key, locale);
      expect(i18nService.translate).toHaveBeenCalledWith(key, { lang: locale });
      expect(result).toEqual(expectedMessage);
    });
    it('should return arabic translate', async () => {
      const key: string = 'messages.success_fetch';
      const locale: string = 'ar';
      const expectedMessage = 'تم استرجاع البيانات بنجاح';
      (i18nService.translate as jest.Mock).mockResolvedValue(expectedMessage);
      const result: string = await service.translate(key, locale);
      expect(i18nService.translate).toHaveBeenCalledWith(key, { lang: locale });
      expect(result).toEqual(expectedMessage);
    });
    it('should handle errors ', async () => {
      const key = 'messages.error';
      const locale = 'en';
      const errorMessage = 'Translation Error';
      (i18nService.translate as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );
      await expect(service.translate(key, locale)).rejects.toThrowError(
        errorMessage,
      );
    });
  });
});
