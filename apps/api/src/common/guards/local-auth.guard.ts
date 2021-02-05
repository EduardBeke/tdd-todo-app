import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export const localType = 'local';
@Injectable()
export class LocalAuthGuard extends AuthGuard(localType) {}
