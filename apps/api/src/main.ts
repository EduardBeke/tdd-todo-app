import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { ErrorsInterceptor } from './common/interceptor/errors.interceptor';
import { RequestValidationError } from './common/exceptions/request-validation.error';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.useGlobalFilters(new AllExceptionsFilter());
	app.useGlobalInterceptors(new ErrorsInterceptor());
	app.useGlobalPipes(
		new ValidationPipe({
			exceptionFactory: (errors) => {
				throw new RequestValidationError(errors);
			},
		})
	);
	const globalPrefix = 'api';
	app.setGlobalPrefix(globalPrefix);
	const port = process.env.PORT || 3333;
	await app.listen(port, () => {
		Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
	});
}

bootstrap();
