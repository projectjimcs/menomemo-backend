import * as cookieParser from 'cookie-parser';
import { ExtractJwt } from 'passport-jwt';
import { Request } from "express";

export const cookieExtractor = (request: Request): string | null => {
  let token = null;

  token = ExtractJwt.fromExtractors([
    (request: Request) => {
      const data = request?.cookies['auth-cookie'];

      if (!data) {
        return null;
      }

      return data.token;
    },
    ExtractJwt.fromHeader('cookie'),
  ])

  let parsedCookie = cookieParser.JSONCookie(token);

  token = parsedCookie && parsedCookie.hasOwnProperty('token') ? parsedCookie['token'] : token;

  return token;
}