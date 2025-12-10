export interface JwtPayload {
  userId: number;
  email: string;
  refreshToken?: string;
}
