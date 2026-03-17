import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { Observable, tap } from 'rxjs';

/**
 * HIPAA §164.312(b): Audit controls — record and examine activity
 * that includes or reasonably could include PHI.
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditLog');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<FastifyRequest & { user?: { id: string } }>();
    const { method, url, ip } = request;
    const userId = request.user?.id ?? 'anonymous';
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        this.logger.log(
          JSON.stringify({
            event: 'api_access',
            userId,
            method,
            path: url,
            ip,
            durationMs: ms,
            timestamp: new Date().toISOString(),
          }),
        );
      }),
    );
  }
}
