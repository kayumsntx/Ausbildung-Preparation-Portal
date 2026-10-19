import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId = (request as any).correlationId || 'unknown';
    const timestamp = new Date().toISOString();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected internal server error occurred.';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        message = resObj.message || exception.message;
        code = resObj.error || HttpStatus[status] || 'HTTP_ERROR';

        // Check if class-validator validation errors array
        if (Array.isArray(resObj.message)) {
          code = 'VALIDATION_FAILED';
          message = 'The request payload failed schema validation.';
          details = resObj.message.map((msg: string) => ({ issue: msg }));
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled Exception [${correlationId}]: ${exception.message}`, exception.stack);
      message = 'An unexpected internal server error occurred.';
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        details,
        timestamp,
        correlationId,
      },
    });
  }
}
