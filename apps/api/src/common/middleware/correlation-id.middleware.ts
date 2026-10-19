import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const correlationHeader = req.headers['x-correlation-id'];
    const correlationId = (typeof correlationHeader === 'string' && correlationHeader.trim().length > 0)
      ? correlationHeader
      : `req_${randomUUID()}`;

    // Attach to request and response
    (req as any).correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);

    next();
  }
}
