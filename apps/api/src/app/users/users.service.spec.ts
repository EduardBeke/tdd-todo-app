import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsernameTakenError } from './errors/username-taken.error';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersService],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should find a user by username', () => {
		jest.spyOn(service, 'findAll').mockImplementation(() => [
			{
				id: '6bb62737-9d95-4026-8e2d-fc6ee8e2b938',
				password: 'password',
				username: 'User',
			},
			{
				id: '10bb0b6a-4063-448b-b772-5ccdd2c69f89',
				password: 'password2',
				username: 'User2',
			},
		]);
		// Given
		const username = 'User';

		// When
		const user: UserDto = service.findOne(username);

		// Then
		expect(user.username).toEqual(username);
	});

	it('should throw an error when a user doesnt exist', () => {
		jest.spyOn(service, 'findAll').mockImplementation(() => [
			{
				id: '6bb62737-9d95-4026-8e2d-fc6ee8e2b938',
				password: 'password',
				username: 'User',
			},
		]);
		// Given
		const username = 'NotExistingUser';

		// When
		const findOne = () => service.findOne(username);

		// Then
		expect(findOne).toThrow(NotFoundException);
	});

	it('should create an user', () => {
		jest.spyOn(service, 'findAll').mockImplementation(() => []);
		// Given
		const createUserDto: CreateUserDto = {
			username: 'User',
			password: 'password',
		};

		// When
		const user: UserDto = service.create(createUserDto);

		// Then
		jest.spyOn(service, 'findAll').mockRestore();
		expect(user.username).toEqual(createUserDto.username);
		expect(service.findAll()).toContainEqual({ ...user, password: createUserDto.password });
	});

	it('should throw an error when creating a user with an already existing username', () => {
		// Given
		const createUserDto: CreateUserDto = {
			username: 'User',
			password: 'password',
		};

		// When
		service.create(createUserDto);

		// Then
		expect(() => service.create(createUserDto)).toThrow(UsernameTakenError);
	});
});
