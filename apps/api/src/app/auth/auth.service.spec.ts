import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { UserDto } from '../users/dtos/user.dto';

describe('AuthService', () => {
	let service: AuthService;
	let usersService: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [JwtModule.register({})],
			providers: [AuthService, UsersService],
		}).compile();

		service = module.get<AuthService>(AuthService);
		usersService = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should validate the user with correct credentials ', () => {
		// Given
		const username = 'User';
		const password = 'password';
		jest.spyOn(usersService, 'findOne').mockImplementation(
			() =>
				({
					username,
					id: '086450f9-586c-46f7-af2b-3d57d9ceb64b',
					password,
				} as User)
		);

		// When
		const user: UserDto = service.signIn(username, password);

		// Then
		expect(user.username).toEqual(username);
	});

	it('should throw an error when password is wrong', () => {
		// Given
		const username = 'User';
		const password = 'wrongPassword';
		jest.spyOn(usersService, 'findOne').mockImplementation(
			() =>
				({
					username,
					id: '086450f9-586c-46f7-af2b-3d57d9ceb64b',
					password: 'realPassword',
				} as User)
		);

		// When
		const signIn = () => service.signIn(username, password);

		// Then
		expect(signIn).toThrow(UnauthorizedException);
	});

	it('should throw an error when user doesnt exist', () => {
		// Given
		const username = 'NotExistingUser';
		const password = 'password';
		jest.spyOn(usersService, 'findAll').mockImplementation(() => [
			{
				username: 'User',
				id: '086450f9-586c-46f7-af2b-3d57d9ceb64b',
				password,
			} as User,
		]);

		// When
		const signIn = () => service.signIn(username, password);

		// Then
		expect(signIn).toThrow(NotFoundException);
	});
});
