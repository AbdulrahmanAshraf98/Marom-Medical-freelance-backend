import { I18nOptions, I18nJsonParser } from 'nestjs-i18n';
import { join } from 'path';

export const i18nConfig: I18nOptions = {
  parser: I18nJsonParser,
  fallbackLanguage: 'en',
  loaderOptions: {
    path: join(__dirname, '../i18n/'), // Adjust path if needed
    watch: true,
  },
};