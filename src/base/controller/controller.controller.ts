import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiBody, ApiHeader, getSchemaPath } from '@nestjs/swagger';
import { BaseService } from '../services/base/base.service';
import { BaseEntity } from '../entities/base-entity/base-entity';
import { ResponseMessage } from '../../common/decorators/response-message/response-message.decorator';

@ApiTags('base')
@Controller()
export abstract class BaseController<T extends BaseEntity, D, CDto, UDto> {
  protected constructor(
    private readonly service: BaseService<T, D>,
    private readonly createDtoClass: new (...args: any[]) => CDto,
    private readonly updateDtoClass: new (...args: any[]) => UDto,
    private readonly responseDtoClass: new (...args: any[]) => D
  ) {}

  static getCreateDtoClass(): any {
    return this.prototype.createDtoClass ?? Object;
  }

  static getUpdateDtoClass(): any {
    return this.prototype.updateDtoClass ?? Object;
  }

  static getResponseDtoClass(): any {
    return this.prototype.responseDtoClass ?? Object;
  }

  @Get()
  @ResponseMessage('messages.success_fetch')
  @ApiOperation({ summary: 'Get all items with pagination' })
  @ApiQuery({ name: 'page', type: Number, description: 'Page number', required: false })
  @ApiQuery({ name: 'limit', type: Number, description: 'Number of items per page', required: false })
  @ApiQuery({ name: 'sortBy', type: String, description: 'Field to sort by', required: false })
  @ApiQuery({ name: 'order', type: String, enum: ['ASC', 'DESC'], description: 'Sort order', required: false })
  @ApiHeader({
    name: 'Accept-Language',
    description: 'The language to return the response in',
    required: false,
    schema: {
      type: 'string',
      example: 'en'
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Data fetched successfully.' },
        status: { type: 'integer', example: 200 },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(BaseController.getResponseDtoClass()) }
            },
            totalCount: { type: 'integer', example: 10 }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Failed to fetch data. Please try again later.' },
        status: { type: 'integer', example: 400 },
        data: {
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'The requested item could not be found.' },
        status: { type: 'integer', example: 404 },
        data: { type: 'object', additionalProperties: { type: 'string' } }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Internal server error' },
        status: { type: 'integer', example: 500 },
        data: { type: 'object', additionalProperties: { type: 'string' } }
      }
    }
  })
  async findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 20,
    @Query('sortBy') sortBy: string = 'id',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC'
  ) {
    return this.service.findAllWithPagination(
      {},
      [],
      page,
      limit,
      sortBy,
      order
    );
  }

  @Post()
  @ResponseMessage('messages.success_create')
  @ApiOperation({ summary: 'Create a new item' })
  @ApiBody({ type: BaseController.getCreateDtoClass() })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Item created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Data created successfully.' },
        status: { type: 'integer', example: 201 },
        data: { $ref: getSchemaPath(BaseController.getResponseDtoClass()) }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Failed to create data. Please try again later.' },
        status: { type: 'integer', example: 400 },
        data: {
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      }
    }
  })
  async create(@Body() createDto: CDto) {
    return this.service.create(createDto as any);
  }

  @Get(':id')
  @ResponseMessage('messages.success_fetch')
  @ApiOperation({ summary: 'Get an item by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Data fetched successfully.' },
        status: { type: 'integer', example: 200 },
        data: { $ref: getSchemaPath(BaseController.getResponseDtoClass()) }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Item not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'The requested item could not be found.' },
        status: { type: 'integer', example: 404 },
        data: { type: 'object', additionalProperties: { type: 'string' } }
      }
    }
  })
  async findOne(@Param('id') id: string) {
    return this.service.findOneBy({ id: Number(id) as any });
  }

  @Put(':id')
  @ResponseMessage('messages.success_update')
  @ApiOperation({ summary: 'Update an item by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Item ID' })
  @ApiBody({ type: BaseController.getUpdateDtoClass() })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Data updated successfully.' },
        status: { type: 'integer', example: 200 },
        data: { $ref: getSchemaPath(BaseController.getResponseDtoClass()) }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Failed to update data. Please try again later.' },
        status: { type: 'integer', example: 400 },
        data: {
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Item not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'The requested item could not be found.' },
        status: { type: 'integer', example: 404 },
        data: { type: 'object', additionalProperties: { type: 'string' } }
      }
    }
  })
  async update(@Param('id') id: string, @Body() updateDto: UDto) {
    return this.service.updateBy({ id: Number(id) as any }, updateDto as any);
  }

  @Delete(':id')
  @ResponseMessage('messages.success_delete')
  @ApiOperation({ summary: 'Delete an item by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Item ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Item deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Data deleted successfully.' },
        status: { type: 'integer', example: 200 },
        data: { type: 'object', additionalProperties: { type: 'string' } }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Item not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'The requested item could not be found.' },
        status: { type: 'integer', example: 404 },
        data: { type: 'object', additionalProperties: { type: 'string' } }
      }
    }
  })
  async delete(@Param('id') id: string) {
    await this.service.deleteBy({ id: Number(id) as any });
    return { message: 'Data deleted successfully.', status: 200, data: {} };
  }
}
