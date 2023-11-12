import { ListResponseData, ResponseData } from './Common';

export interface IBaseService<T> {
  findAll(
    query: string,
    page?: number,
    size?: number,
  ): Promise<ListResponseData<T>>;
  findById(id: any, entityName: string): Promise<ResponseData<T>>;
}
