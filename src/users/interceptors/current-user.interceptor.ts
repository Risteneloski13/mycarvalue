import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

// CurrentUserInterceptor is an interceptor
// Implements NestInterceptor as a guide that tells us
// through typeScript exactly how to put interceptor together
// Inside CurrentUserInterceptor we will use of DI
// To get access to a copy of the UsersService
// To make use of Dependency Injection at all
// We have to mark the class as Injectable
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  // context is very similar to a decorator context
  // its like a wrapper to an incoming request
  // handler is a reference of an actual route handler that is
  // going to run at some point of time
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
