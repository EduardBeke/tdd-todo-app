export interface JwtPayload {
	username: string;
	id: string;
	iat?: number;
	exp?: number;
}
