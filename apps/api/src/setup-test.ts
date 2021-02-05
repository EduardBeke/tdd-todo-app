import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { ErrorsInterceptor } from './common/interceptor/errors.interceptor';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { RequestValidationError } from './common/exceptions/request-validation.error';
import { TestingModule } from '@nestjs/testing';

export const testApp = (moduleRef: TestingModule): INestApplication => {
	const app = moduleRef.createNestApplication();
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
	return app;
};
