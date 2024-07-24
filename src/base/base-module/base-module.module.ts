import { Module } from '@nestjs/common';
import { BaseRepository } from '../repositories/base-repository/base-repository';
import { BaseService } from '../services/base/base.service';
import { BaseController } from '../controller/controller.controller';
import { TestServiceService } from '../../../test/__mocks__/test-service/test-service.service';
import { TestRepository } from '../../../test/__mocks__/test-repository/test-repository';

@Module({
  providers: [

    {
      provide: 'BaseRepository',
      useClass: BaseRepository,
    },
  ],
  exports: ['BaseRepository',],
})
export class BaseModuleModule {}
