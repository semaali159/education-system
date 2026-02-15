

import { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';  // صحح المسار حسب موقعك

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}