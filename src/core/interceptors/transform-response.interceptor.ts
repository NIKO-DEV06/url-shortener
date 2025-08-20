import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TranformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (!response) {
          return {
            statusCode: 200,
            message: 'Success',
            data: [],
          };
        }
        if (response.data && response.meta) {
          return {
            statusCode: 200,
            message: 'Success',
            data: response.data,
            meta: response.meta,
          };
        }
        return {
          statusCode: 200,
          message: 'Success',
          data: response,
        };
      }),
    );
  }
}
