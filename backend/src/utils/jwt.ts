import { SignJWT, jwtVerify } from 'jose';
import { AccessTokenPayload } from 'src/interfaces/accessTokenPayload.interface';
import { RefreshTokenPayload } from 'src/interfaces/refreshTokenPayload.interface';
import { User } from 'src/interfaces/user.interface';

export async function createToken(payload: any, expiresIn: string | number) {
  if (!process.env.JWT_SECRET) return null;
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET),
  );
  return payload;
}

export async function signAccessToken(payload: AccessTokenPayload) {
  return await createToken(payload, '1h');
}

export async function signRefreshToken(payload: RefreshTokenPayload) {
  return await createToken(payload, '7d');
}
