import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.model';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UsernameTakenError } from './errors/username-taken.error';

@Injectable()
export class UsersService {
	private readonly users: User[] = [
		{
			id: '6bb62737-9d95-4026-8e2d-fc6ee8e2b938',
			password: 'password1',
			username: 'User1',
		},
		{
			id: '10bb0b6a-4063-448b-b772-5ccdd2c69f89',
			password: 'password2',
			username: 'User2',
		},
	];

	findAll(): User[] {
		return [...this.users];
	}

	findOne(username: string): User {
		const user = this.findAll().find((user) => user.username === username);
		if (!user) throw new NotFoundException(`User ${username} doesnt exist`);
		return user;
	}

	create({ username, password }: CreateUserDto): UserDto {
		// Ofc passwords should be hashed
		const newUser: User = {
			id: uuidv4(),
			username,
			password,
		};

		if (this.findAll().find((user) => user.username.toLowerCase() === username.toLowerCase())) {
			throw new UsernameTakenError(username);
		}

		this.users.push(newUser);
		return { id: newUser.id, username };
	}
}
