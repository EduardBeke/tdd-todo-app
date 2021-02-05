import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { jwtConstants } from '../../common/constants';
import { UserDto } from '../users/dtos/user.dto';
import { cookieExtractor } from '../../common/utils/cookie-extractor';
import { Request } from 'express';
import { jwtType } from '../../common/guards/jwt-auth.guard';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, jwtType) {
	constructor() {
		const jwtFromRequest = (req: Request) => cookieExtractor(req, jwtConstants.cookieKey);
		super({
			jwtFromRequest,
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	validate(payload: JwtPayload): UserDto {
		return { id: payload.id, username: payload.username };
	}
}
