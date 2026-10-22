import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Global input sanitization interceptor to defend against:
 * - Cross-Site Scripting (XSS) via injected HTML / JavaScript
 * - Prototype pollution attempts
 */
@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();

    if (req.body && typeof req.body === 'object') {
      req.body = this.sanitizeValue(req.body);
    }

    if (req.query && typeof req.query === 'object') {
      req.query = this.sanitizeValue(req.query);
    }

    if (req.params && typeof req.params === 'object') {
      req.params = this.sanitizeValue(req.params);
    }

    return next.handle();
  }

  public sanitizeValue(val: any): any {
    if (val === null || val === undefined) {
      return val;
    }

    if (typeof val === 'string') {
      return this.cleanString(val);
    }

    if (Array.isArray(val)) {
      return val.map((item) => this.sanitizeValue(item));
    }

    if (typeof val === 'object') {
      const cleanObj: Record<string, any> = {};
      for (const [key, value] of Object.entries(val)) {
        // Block prototype pollution keys
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          continue;
        }
        cleanObj[key] = this.sanitizeValue(value);
      }
      return cleanObj;
    }

    return val;
  }

  private cleanString(str: string): string {
    // Strip <script> tags and enclosed script content
    let sanitized = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Strip javascript: pseudo-protocol URIs
    sanitized = sanitized.replace(/javascript:[^"']*/gi, '');

    // Strip inline event handlers like onerror=, onclick=, onload=
    sanitized = sanitized.replace(/\bon\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

    // Strip iframe and object tags
    sanitized = sanitized.replace(/<\/?(iframe|object|embed|applet)\b[^>]*>/gi, '');

    return sanitized;
  }
}
