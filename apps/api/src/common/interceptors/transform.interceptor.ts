import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface ResponseEnvelope<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    correlationId?: string;
    pagination?: any;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseEnvelope<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const correlationId = (request as any).correlationId;

    return next.handle().pipe(
      map((result) => {
        // If result already formatted or contains pagination
        let data = result;
        let pagination: any = undefined;

        if (result && typeof result === 'object' && 'items' in result && 'pagination' in result) {
          data = result.items;
          pagination = result.pagination;
        }

        return {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
            correlationId,
            ...(pagination ? { pagination } : {}),
          },
        };
      }),
    );
  }
}
