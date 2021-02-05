import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dtos/user.dto';
import { localType } from '../../common/guards/local-auth.guard';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, localType) {
	constructor(private authService: AuthService) {
		super();
	}

	validate(username: string, password: string): UserDto {
		const user = this.authService.signIn(username, password);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
