import { SerializedError } from './serialized-error.model';

export abstract class CustomError extends Error {
	abstract readonly statusCode: number;

	protected constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, CustomError.prototype);
	}

	abstract serializeErrors(): SerializedError[];
}
