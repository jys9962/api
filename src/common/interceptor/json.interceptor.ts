import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class JsonInterceptor implements NestInterceptor {
  readonly SEARCH_DEPTH = 8

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((value) => convert(value, this.SEARCH_DEPTH)))
  }
}

const convert = (data: any, depth: number): any => {
  if (data == null) {
    return null
  }

  if (depth <= 0) {
    return data
  }

  if(typeof data === 'bigint') {
    return data.toString()
  }

  if (Array.isArray(data)) {
    return data.map((t) => convert(t, depth - 1))
  }

  if (typeof data === 'object') {
    return Object.keys(data).reduce((acc: Record<string, any>, key) => {
      acc[key] = convert(data[key], depth - 1)
      return acc
    }, {})
  }

  return data
}

