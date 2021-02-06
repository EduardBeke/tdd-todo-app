import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [UsersModule, TodosModule, AuthModule],
})
export class AppModule {}
