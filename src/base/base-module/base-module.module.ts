import { Module } from '@nestjs/common';
import { BaseService } from '../services/base-service/base-service.service';
import { BaseRepository } from '../repositories/base-repository/base-repository';

@Module({
  providers: [
    BaseService,
    {
      provide: 'BaseRepository',
      useClass: BaseRepository,
    },
  ],
  exports: [BaseService, 'BaseRepository'],
})
export class BaseModuleModule {}
