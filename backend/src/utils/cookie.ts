import { Response } from 'express';

export function setCookie(
  res: Response,
  key: string,
  value: string,
  maxAge?: number,
) {
  res.cookie(key, value, {
    maxAge: maxAge,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
}
