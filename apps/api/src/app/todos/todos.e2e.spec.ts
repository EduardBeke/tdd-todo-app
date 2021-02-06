import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { testApp } from '../../setup-test';
import * as request from 'supertest';
import { LoginDto } from '../auth/dtos/login.dto';
import { AuthService } from '../auth/auth.service';
import { UserDto } from '../users/dtos/user.dto';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodoDto } from './dtos/todo.dto';
import { TodosModule } from './todos.module';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { TodosService } from './todos.service';

describe('Todos', () => {
	let app: INestApplication;
	let authService: AuthService;
	let todosService: TodosService;
	let cookies: string;

	const getCookies = async (username: string, id: string) => {
		jest.spyOn(authService, 'signIn').mockImplementation(
			() =>
				({
					username,
					id,
				} as UserDto)
		);
		const response = await request(app.getHttpServer())
			.post('/auth/signin')
			.send({
				username: username,
				password: 'password',
			} as LoginDto);
		return response.get('set-cookie')[0];
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [TodosModule],
		}).compile();
		app = testApp(module);
		authService = module.get<AuthService>(AuthService);
		todosService = module.get<TodosService>(TodosService);
		await app.init();

		cookies = await getCookies('User', 'bceda57c-d0b0-4691-9e35-87b17482ea37');
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('Create Todo', () => {
		it('should return 201 when user is logged in and creates todo', async () => {
			// Given
			const createTodoDto: CreateTodoDto = {
				title: 'Buy milk',
				description: 'Go to the store and buy milk for baby',
				done: false,
			};

			// When
			const response = await request(app.getHttpServer())
				.post('/todos')
				.set('Cookie', [cookies])
				.send({
					title: createTodoDto.title,
					description: createTodoDto.description,
					done: createTodoDto.done,
				} as CreateTodoDto)
				.expect(201);

			// Then
			expect(response.body as TodoDto).toEqual(expect.objectContaining({ ...createTodoDto }));
			expect((response.body as TodoDto).id).toBeDefined();
		});

		it('should return a 400 when providing invalid data for todo', async () => {
			// Given
			const createTodoDto: CreateTodoDto = {
				title: '',
				description: '',
				done: false,
			};

			// When
			await request(app.getHttpServer())
				.post('/todos')
				.set('Cookie', [cookies])
				.send({
					title: createTodoDto.title,
					description: createTodoDto.description,
					done: createTodoDto.done,
				} as CreateTodoDto)
				// Then
				.expect(400);
		});

		it('should return 401 when a user is not logged in and tries to create', async () => {
			// Given
			const createTodoDto: CreateTodoDto = {
				title: 'Buy milk',
				description: 'Go to the store and buy milk for baby',
				done: false,
			};

			// When
			await request(app.getHttpServer())
				.post('/todos')
				.send({
					title: createTodoDto.title,
					description: createTodoDto.description,
					done: createTodoDto.done,
				} as CreateTodoDto)
				.expect(401);
		});
	});

	describe('Update Todo', () => {
		let todo: TodoDto;

		beforeEach(async () => {
			const response = await request(app.getHttpServer())
				.post('/todos')
				.set('Cookie', [cookies])
				.send({
					title: 'Buy milk',
					description: 'Go to the store and buy milk for baby',
					done: false,
				} as CreateTodoDto)
				.expect(201);
			todo = response.body;
		});

		it('should return 200 when logged in user is logged in and updates todo', async () => {
			// Given
			const updateTodoDto: UpdateTodoDto = {
				title: 'New Title',
				description: 'New description',
				done: false,
				id: todo.id,
			};

			// When
			const response = await request(app.getHttpServer())
				.put(`/todos/${todo.id}`)
				.set('Cookie', [cookies])
				.send(updateTodoDto)
				.expect(200);

			// Then
			expect(response.body as TodoDto).toEqual(expect.objectContaining({ ...updateTodoDto }));
		});

		it('should return 400 when logged in user is logged in and updates todo but provides invalid data', async () => {
			// Given
			const updateTodoDto: UpdateTodoDto = {
				title: '',
				description: '',
				done: false,
				id: todo.id,
			};

			// When
			await request(app.getHttpServer())
				.put(`/todos/${todo.id}`)
				.set('Cookie', [cookies])
				.send(updateTodoDto)
				// Then
				.expect(400);
		});

		it('should return 401 when not logged in user tries to update todo', async () => {
			// Given
			const updateTodoDto: UpdateTodoDto = {
				title: 'New Title',
				description: 'New description',
				done: false,
				id: todo.id,
			};

			// When
			await request(app.getHttpServer())
				.put(`/todos/${todo.id}`)
				.send(updateTodoDto)
				// Then
				.expect(401);
		});

		it('should return 401 when user tries to update other users todo', async () => {
			// Given
			const updateTodoDto: UpdateTodoDto = {
				title: 'New Title',
				description: 'New description',
				done: false,
				id: todo.id,
			};

			// When
			await request(app.getHttpServer())
				.put(`/todos/${todo.id}`)
				.set('Cookie', [await getCookies('User2', 'c57d0cea-ecda-4c4e-a4b2-b391cb96c48b')])
				.send(updateTodoDto)
				// Then
				.expect(401);
		});
	});

	describe('Delete Todo', () => {
		let todo: TodoDto;

		beforeEach(async () => {
			const response = await request(app.getHttpServer())
				.post('/todos')
				.set('Cookie', [cookies])
				.send({
					title: 'Buy milk',
					description: 'Go to the store and buy milk for baby',
					done: false,
				} as CreateTodoDto)
				.expect(201);
			todo = response.body;
		});

		it('should return 204 when logged in user deletes a todo', async () => {
			// When
			await request(app.getHttpServer())
				.delete(`/todos/${todo.id}`)
				.set('Cookie', [cookies])
				.send({})
				// Then
				.expect(200);
		});

		it('should return 404 when logged in user tries to delete a todo that does not exist', async () => {
			// Given
			const notExistingTodoId = '3ab0c523-174f-4ad4-bf47-4d65bff0658d';

			// When
			await request(app.getHttpServer())
				.delete(`/todos/${notExistingTodoId}`)
				.set('Cookie', [cookies])
				.send({})
				// Then
				.expect(404);
		});

		it('should return 401 when logged in user tires to delete an other users todo', async () => {
			// When
			await request(app.getHttpServer())
				.delete(`/todos/${todo.id}`)
				.set('Cookie', [await getCookies('User2', 'd8857a8d-a5f7-48f4-b353-bbacd893b922')])
				.send({})
				// Then
				.expect(401);
		});

		it('should return 401 when not logged in user tries to delete a todo', async () => {
			// When
			await request(app.getHttpServer())
				.delete(`/todos/${todo.id}`)
				.send({})
				// Then
				.expect(401);
		});
	});

	describe('Get Todos', () => {
		const todos: TodoDto[] = [
			{
				id: 'c5d654db-f71d-4432-b2c1-73b4786bcbf5',
				title: 'Study for math',
				description: 'Study for the math exam next week',
				done: false,
			},
		];

		beforeEach(async () => {
			jest.spyOn(todosService, 'findAllByUserId').mockImplementation(() => {
				return todos;
			});
		});

		it('should return 200 and all todos of a logged in user', async () => {
			// When
			const response = await request(app.getHttpServer())
				.get('/todos')
				.set('Cookie', cookies)
				.send()
				.expect(200);

			// Then
			expect(response.body as TodoDto[]).toEqual(todos);
		});

		it('should return 401 when not logged in user tries to fetch todos', async () => {
			// When
			await request(app.getHttpServer())
				.get('/todos')
				.send()
				// Then
				.expect(401);
		});
	});
});
