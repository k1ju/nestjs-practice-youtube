import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Next,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof HttpException) {
      return;
    }
    if (exception.message.includes('no such file or directory')) {
      return response.status(404).json({
        message: 'no API',
        error: 'Not Found',
        statusCode: 404,
      });
    }

    // Error
    response.status(500).json({
      message: 'Error',
    });
  }
}
