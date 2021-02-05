import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const jwtType = 'jwt';
@Injectable()
export class JwtAuthGuard extends AuthGuard(jwtType) {}
