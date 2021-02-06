import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtDto } from './dtos/jwt.dto';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dtos/user.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	signIn(username: string, password: string): UserDto {
		const user = this.usersService.findOne(username);
		if (user?.password === password) {
			return { username, id: user.id };
		}
		throw new UnauthorizedException('Wrong credentials!');
	}

	generateJwt(user: UserDto): JwtDto {
		const payload: JwtPayload = { username: user.username, id: user.id };
		return {
			jwt: this.jwtService.sign(payload),
		};
	}

	signUp(createUserDto: CreateUserDto): JwtDto {
		const user = this.usersService.create(createUserDto);
		return this.generateJwt(user);
	}
}
