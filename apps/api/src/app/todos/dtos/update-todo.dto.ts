import { IsBoolean, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateTodoDto {
	@IsNotEmpty()
	id: string;
	@IsBoolean()
	done: boolean;
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(20)
	title: string;
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(150)
	description: string;
}
