import { Request } from 'express';

export const cookieExtractor = (req: Request, key: string) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies[key];
	}
	return token;
};
