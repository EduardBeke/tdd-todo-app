import { Body, Controller, Get, HttpCode, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { jwtConstants } from '../../common/constants';
import { JwtDto } from './dtos/jwt.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('signin')
	@HttpCode(200)
	signIn(@Request() req, @Res({ passthrough: true }) response: Response) {
		const jwtDto = this.authService.generateJwt(req.user);
		AuthController.setJwtCookie(response, jwtDto);
		return jwtDto;
	}

	@Post('signup')
	signUp(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
		const jwtDto = this.authService.signUp(createUserDto);
		AuthController.setJwtCookie(response, jwtDto);
		return jwtDto;
	}

	private static setJwtCookie(response: Response, jwtDto: JwtDto) {
		response.cookie(jwtConstants.cookieKey, jwtDto.jwt);
	}

	@UseGuards(JwtAuthGuard)
	@Get('whoAmI')
	getProfile(@Request() req) {
		return req.user;
	}
}
