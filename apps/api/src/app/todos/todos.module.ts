import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from '../auth/auth.controller';

@Module({
	imports: [AuthModule],
	controllers: [TodosController, AuthController],
	providers: [TodosService, TodosController],
	exports: [TodosController, TodosService],
})
export class TodosModule {}
