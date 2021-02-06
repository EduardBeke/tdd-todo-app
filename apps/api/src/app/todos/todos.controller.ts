import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Request,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodosService } from './todos.service';
import { UpdateTodoDto } from './dtos/update-todo.dto';

@Controller('todos')
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	findAllByUserId(@Request() req) {
		return this.todosService.findAllByUserId(req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
		return this.todosService.create(createTodoDto, req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Put(':id')
	update(@Body() updateTodoDto: UpdateTodoDto, @Request() req) {
		return this.todosService.update(updateTodoDto, req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	delete(@Param() params, @Request() req) {
		return this.todosService.delete(params.id, req.user.id);
	}
}
