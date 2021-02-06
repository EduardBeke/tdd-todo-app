import { Request } from 'express';

export const cookieExtractor = (req: Request, key: string) => {
	return req.cookies[key];
};
