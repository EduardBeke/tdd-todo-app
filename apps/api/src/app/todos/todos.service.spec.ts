import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodoDto } from './dtos/todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Todo } from './todo.model';
import objectContaining = jasmine.objectContaining;

describe('TodosService', () => {
	let service: TodosService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TodosService],
		}).compile();

		service = module.get<TodosService>(TodosService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a todo with valid properties', () => {
		// Given
		const userId = '9b9106d1-45f2-4733-9710-404369accb3c';
		const createTodoDto: CreateTodoDto = {
			title: 'Buy milk',
			description: 'Go to the store and buy milk for baby',
			done: false,
		};

		// When
		const todo: TodoDto = service.create(createTodoDto, userId);

		// Then
		expect(todo).toEqual(
			expect.objectContaining({
				title: createTodoDto.title,
				description: createTodoDto.description,
				done: createTodoDto.done,
			} as TodoDto)
		);
		expect(todo.id).toBeDefined();

		expect(service.findAll()).toContainEqual(
			expect.objectContaining({
				...todo,
				id: expect.any(String),
			})
		);
	});

	describe('Update Todo', () => {
		it('should update an existing todo', () => {
			// Given
			const todoToUpdate: CreateTodoDto = {
				title: 'Buy milk',
				description: 'Go to the store and buy milk for baby',
				done: false,
			};
			const userId = 'b1979f2a-8461-441c-8ad8-8f27673e4c8c';
			const { id } = service.create(todoToUpdate, userId);

			const updateTodoDto: UpdateTodoDto = {
				id,
				title: 'Buy milk',
				description: 'Go to the store and buy milk for baby',
				done: false,
			};

			// When
			const todo: TodoDto = service.update(updateTodoDto, userId);

			// Then
			expect(todo).toEqual(expect.objectContaining({ ...updateTodoDto }));
			expect(service.findAll()).toContainEqual(expect.objectContaining({ ...updateTodoDto }));
		});

		it('should throw an error when todo doesnt exist', () => {
			const updateTodoDto: UpdateTodoDto = {
				id: '8103fd3d-d12d-48c9-b403-a4022fdf8d05',
				title: 'Buy milk',
				description: 'Go to the store and buy milk for baby',
				done: false,
			};

			// When
			const update = () => service.update(updateTodoDto, '4ffa69b4-7535-4038-81f6-85561aa038ec');

			// Then
			expect(update).toThrow(NotFoundException);
		});

		it('should throw an error when user is not creator of todo', () => {
			// Given
			const todoToUpdate: CreateTodoDto = {
				title: 'Buy milk',
				description: 'Go to the store and buy milk for baby',
				done: false,
			};
			const userId = 'b1979f2a-8461-441c-8ad8-8f27673e4c8c';
			const otherUserId = '3b5b8618-fcf8-43b4-b98a-8c8a72ccbf35';
			const { id } = service.create(todoToUpdate, userId);

			const updateTodoDto: UpdateTodoDto = {
				id,
				title: 'Buy milk',
				description: 'Go to the store and buy milk for baby',
				done: false,
			};

			// When
			const update = () => service.update(updateTodoDto, otherUserId);

			// Then
			expect(update).toThrow(UnauthorizedException);
		});
	});

	describe('Delete Todo', () => {
		const userId = 'bac5b065-8b47-4a75-895d-fbf90f08a2d6';
		let todo: TodoDto;
		beforeEach(() => {
			todo = service.create(
				{ title: 'Buy milk', description: 'Go to the store and buy milk for baby', done: false },
				userId
			);
		});

		it('should delete a todo', () => {
			service.delete(todo.id, userId);

			expect(service.findAll()).not.toContainEqual(
				expect.objectContaining({
					...todo,
					userId,
				})
			);
		});

		it('should throw an error when todo doesnt exist', () => {
			service.delete(todo.id, userId);
			const deleteTodo = () => service.delete(todo.id, userId);

			expect(deleteTodo).toThrow(NotFoundException);
		});

		it('should throw an error when deleting other users todo', () => {
			const otherUserId = '6842cd08-be66-4a98-ac47-64b6a0922ea3';
			const deleteTodo = () => service.delete(todo.id, otherUserId);

			expect(deleteTodo).toThrow(UnauthorizedException);
		});
	});

	describe('Get Todos', () => {
		it('should get all todos of an user', () => {
			// Given
			const userId = 'abd6ab5e-16f2-47f5-be69-0e5298b13eb5';
			const expectedTodos: Todo[] = [
				{
					id: 'c5d654db-f71d-4432-b2c1-73b4786bcbf5',
					title: 'Buy milk',
					description: 'Go to the store and buy milk for baby',
					done: false,
					userId,
				},
				{
					id: 'c5d654db-f71d-4432-b2c1-73b4786bcbf5',
					title: 'Study for math',
					description: 'Study for the math exam next week',
					done: false,
					userId: '266ca52e-d587-4e6e-a0d6-b9490a075022',
				},
			];
			jest.spyOn(service, 'findAll').mockImplementation(() => expectedTodos);

			// When
			const todos: TodoDto[] = service.findAllByUserId(userId);

			// Then
			expect(todos.length).toEqual(1);
			expect(expectedTodos[0]).toEqual(
				expect.objectContaining({
					...todos[0],
				})
			);
		});
	});
});
