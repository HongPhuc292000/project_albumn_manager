import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  HttpExceptionBody,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string | string[] = 'unknown error';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = exception.message;
      const exceptionBody = exception.getResponse() as HttpExceptionBody;
      message = exceptionBody.message;
    }
    if (exception instanceof QueryFailedError) {
      message = exception.message;
    }
    response.status(status).json({
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: error,
    });
  }
}
