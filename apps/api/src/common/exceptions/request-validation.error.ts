import { CustomError } from './custom.error';
import { SerializedError } from './serialized-error.model';
import { ValidationError } from 'class-validator';

export class RequestValidationError extends CustomError {
	readonly statusCode: number = 400;

	constructor(public readonly errors: ValidationError[]) {
		super('Invalid request parameters');
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	serializeErrors(): SerializedError[] {
		const constraints: {
			message: string;
			field: string;
		}[] = [];
		this.errors.forEach((error) => {
			for (const constraint in error.constraints) {
				constraints.push({
					message: error.constraints[constraint],
					field: error.property,
				});
			}
		});
		return constraints;
	}
}
