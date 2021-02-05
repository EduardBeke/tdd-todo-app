import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { SerializedError } from '../exceptions/serialized-error.model';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const status = exception.getStatus();

		let body: SerializedError[] = [
			{
				message:
					typeof exception.getResponse() === 'object'
						? (<any>exception.getResponse()).message
						: exception.message,
			},
		];

		if (exception.getResponse() instanceof Array) {
			body = exception.getResponse() as SerializedError[];
		}

		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		response.status(status).json(body);
	}
}
