import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TranslationService {
  constructor(private readonly i18nService: I18nService) {}
  async translate(key: string, locale: string): Promise<string> {
    return this.i18nService.translate(key, { lang: locale });
  }
}
