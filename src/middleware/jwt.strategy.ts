import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    // 1. Regardez votre console Backend (terminal) après avoir cliqué sur "Enregistrer"
    console.log('--- [DEBUG JWT] PAYLOAD DÉCODÉ ---', payload);
    return {
      userId: payload.sub || payload.id || null,
      role: payload.role,
    };
  }
}
