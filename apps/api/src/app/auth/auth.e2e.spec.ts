import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from './auth.module';
import * as request from 'supertest';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { UserDto } from '../users/dtos/user.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { testApp } from '../../setup-test';
import { LoginDto } from './dtos/login.dto';

describe('Auth', () => {
	let app: INestApplication;
	let usersService: UsersService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AuthModule],
		}).compile();

		app = testApp(moduleRef);
		usersService = moduleRef.get<UsersService>(UsersService);
		await app.init();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should return 200 when providing correct credentials', async () => {
		// Given
		const user: User = {
			username: 'User',
			id: '84ddf958-0213-475b-8582-2a7e1ef4d400',
			password: 'password',
		};
		jest.spyOn(usersService, 'findAll').mockImplementation(() => [user]);

		// When
		const response = await request(app.getHttpServer())
			.post('/auth/signin')
			.send({
				username: user.username,
				password: user.password,
			} as LoginDto)
			.expect(200);

		// Then
		expect(response.get('set-cookie')[0]).toBeDefined();
	});

	it('should return 201 on successful sign up', async () => {
		jest.spyOn(usersService, 'findAll').mockImplementation(() => []);
		// Given
		const username = 'User';

		// When
		const response = await request(app.getHttpServer())
			.post('/auth/signup')
			.send(({
				username,
				password: 'password',
			} as unknown) as CreateUserDto)
			.expect(201);

		// Then
		const cookies = response.get('set-cookie');
		expect(cookies).toBeDefined();

		const whoAmIResponse = await request(app.getHttpServer())
			.get('/auth/whoAmI')
			.set('Cookie', [cookies])
			.expect(200);
		expect((whoAmIResponse.body as UserDto).username).toEqual(username);
	});

	it('should return 401 when providing wrong credentials', async () => {
		// Given
		const user: User = {
			username: 'User',
			id: '84ddf958-0213-475b-8582-2a7e1ef4d400',
			password: 'password',
		};
		jest.spyOn(usersService, 'findAll').mockReturnValue([user]);

		// When
		await request(app.getHttpServer())
			.post('/auth/signin')
			.send({
				username: user.username,
				password: 'wrongPassword',
			} as LoginDto)
			// Then
			.expect(401);
	});

	it('should return 400 when signing up with an already existing username', async () => {
		// Given
		const user: User = {
			username: 'User',
			id: '84ddf958-0213-475b-8582-2a7e1ef4d400',
			password: 'password',
		};
		jest.spyOn(usersService, 'findAll').mockImplementation(() => [user]);

		// When
		await request(app.getHttpServer())
			.post('/auth/signup')
			.send(({
				username: user.username,
				password: user.password,
			} as unknown) as CreateUserDto)
			// Then
			.expect(400);
	});

	it('should return 400 when signing up with invalid credentials', async () => {
		// Given
		const username = '';
		const password = '';

		// When
		await request(app.getHttpServer())
			.post('/auth/signup')
			.send(({
				username,
				password,
			} as unknown) as CreateUserDto)
			// Then
			.expect(400);
	});
});
