import { CustomError } from '../../../common/exceptions/custom.error';

export class UsernameTakenError extends CustomError {
	readonly statusCode: number = 400;

	constructor(public readonly username) {
		super(`Username ${username} already taken!`);
		Object.setPrototypeOf(this, UsernameTakenError.prototype);
	}

	serializeErrors(): { message: string; field?: string }[] {
		return [{ message: this.message }];
	}
}
