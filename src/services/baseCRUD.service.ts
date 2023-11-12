import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IBaseService } from 'src/types/BaseService';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { ListResponseData, ResponseData } from 'src/types';

export abstract class BaseService<Entity extends CustomBaseEntity>
  implements IBaseService<Entity>
{
  constructor(private readonly genericRepository: Repository<Entity>) {}

  async findAll(
    query: string,
    page?: number,
    size?: number,
  ): Promise<ListResponseData<Entity>> {
    const queryPage = page;
    const querySize = size;
    const records = await this.genericRepository.query(query);
    const totalRecord = await this.genericRepository.count();
    return new ListResponseData(
      records,
      HttpStatus.OK,
      'ok',
      queryPage,
      querySize,
      totalRecord,
    );
  }

  async findById(id: any, entityName: string): Promise<ResponseData<Entity>> {
    const entity = await this.genericRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Not found this ${entityName}`);
    }
    return new ResponseData(entity, HttpStatus.OK, 'ok');
  }
}
