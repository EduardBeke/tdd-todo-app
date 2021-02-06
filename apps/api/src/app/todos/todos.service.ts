import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { Todo } from './todo.model';
import { TodoDto } from './dtos/todo.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateTodoDto } from './dtos/update-todo.dto';

@Injectable()
export class TodosService {
	private todos: Todo[] = [
		{
			id: '333f2752-981a-4a3e-a296-36d274d1d057',
			title: 'Read book',
			description: 'Read 20 pages from xyz',
			done: false,
			userId: '6bb62737-9d95-4026-8e2d-fc6ee8e2b938',
		},
		{
			id: '333f2752-981a-4a3e-a296-36d274d1d057',
			title: 'Gym',
			description: 'Go to the gym',
			done: true,
			userId: '10bb0b6a-4063-448b-b772-5ccdd2c69f89',
		},
	];

	findAll(): Todo[] {
		return [...this.todos];
	}

	findOne(id: string): Todo {
		const todo = this.findAll().find((todo) => todo.id === id);
		if (!todo) {
			throw new NotFoundException(`Todo with id ${id} not found!`);
		}
		return todo;
	}

	create({ done, description, title }: CreateTodoDto, userId: string): TodoDto {
		const newTodo: Todo = {
			id: uuidv4(),
			done,
			description,
			title,
			userId,
		};

		this.todos.push(newTodo);

		const { userId: _, ...todoDto } = newTodo;
		return todoDto;
	}

	update({ description, title, done, id }: UpdateTodoDto, userId: string): TodoDto {
		const { userId: foundUserId } = this.findOne(id);

		if (foundUserId !== userId) {
			throw new UnauthorizedException();
		}

		const updatedTodo: Todo = {
			id,
			userId,
			description,
			done,
			title,
		};

		this.todos = this.todos.map((todo) => {
			return todo.id === id ? updatedTodo : todo;
		});

		return updatedTodo;
	}

	delete(id: string, userId: string) {
		const { userId: foundUserId } = this.findOne(id);
		if (userId !== foundUserId) {
			throw new UnauthorizedException();
		}
		this.todos = this.todos.filter((todo) => todo.id !== id);
	}

	findAllByUserId(userId: string): TodoDto[] {
		return this.findAll()
			.filter((todo) => todo.userId === userId)
			.map(({ id, title, description, done }) => {
				return {
					id,
					title,
					description,
					done,
				};
			});
	}
}
