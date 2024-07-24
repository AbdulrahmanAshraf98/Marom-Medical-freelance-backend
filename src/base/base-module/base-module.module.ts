import { Module } from '@nestjs/common';
import { BaseRepository } from '../repositories/base-repository/base-repository';
import { BaseService } from '../services/base/base.service';

@Module({
  providers: [

    {
      provide: 'BaseRepository',
      useClass: BaseRepository,
    },

    BaseService
  ],
  exports: [ 'BaseRepository',BaseService ],
})
export class BaseModuleModule {}
