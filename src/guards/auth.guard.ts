import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // If this returns true, the request continues to the controller
    // If this returns false, NestJS automatically throws a 403 Forbidden
    return request.session.userId;
  }
}
