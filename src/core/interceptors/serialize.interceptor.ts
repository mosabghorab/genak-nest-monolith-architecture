import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor, message: string) {
  return UseInterceptors(new SerializeInterceptor(dto, message));
}

class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor, private message: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    // run code before connecting to route handler.
    // ...
    return next.handle().pipe(
      map((data: any) => {
        // run code before returning a response.
        return {
          status: true,
          code: 200,
          message: this.message,
          data: plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          }),
        };
      }),
    );
  }
}
