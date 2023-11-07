export class ResponseData<D> {
  data: D | D[];
  statusCode: number;
  message: string;

  constructor(data: D | D[], statusCode: number, message: string) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;

    return this;
  }
}

export class ListResponseData<T> extends ResponseData<T> {
  page: number;
  size: number;
  total: number;

  constructor(
    data: T[],
    statusCode: number,
    message: string,
    page: number,
    size: number,
    total: number,
  ) {
    super(data, statusCode, message);

    this.page = page;
    this.size = size;
    this.total = total;

    return this;
  }
}

export interface CommonQuery {
  searchKey: string;
  page: number;
  size: number;
}
