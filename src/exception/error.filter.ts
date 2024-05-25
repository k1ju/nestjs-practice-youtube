import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.message.includes('no such file or directory')) {
      return response.status(404).json({
        message: 'no API',
      });
    }

    // Error
    response.status(500).json({
      message: 'Error',
    });
  }
}
