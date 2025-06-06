import { Request } from 'express';
import { verifyToken } from './jwt';

export const getTokenObj = async <T>(
  req: Request,
  key: string,
): Promise<null | T> => {
  if (!req) return null;
  if (!Object.prototype.hasOwnProperty.call(req.cookies, key)) return null;
  const token = (req.cookies as any)[key];
  const verifiedToken: T = (await verifyToken(token)) as any;
  return verifiedToken || null;
};
