import { Request } from 'express';
import { verifyToken } from './jwt';

export const getTokenObj = async <T>(
  req: Request,
  key: string,
): Promise<null | T> => {
  if (!req) return null;
  if (!req.cookies) return null;
  if (!Object.prototype.hasOwnProperty.call(req.cookies, key)) return null;
  const token = (req.cookies as any)[key];
  if (!token) return null;
  const verifiedToken: T = (await verifyToken(token)) as any;
  return verifiedToken || null;
};
