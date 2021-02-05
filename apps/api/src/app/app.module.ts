import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

@Module({
	imports: [UsersModule, TodosModule, AuthModule],
	controllers: [AuthController],
})
export class AppModule {}
