import {BadRequestException, Controller, Get, Post, Req} from "@nestjs/common";
import {KeycloakPasswordStrategy} from "./keycloak-password.strategy";
import {AccessToken} from "./AccessToken";
import { Token } from "keycloak-connect";
import { ApiTags } from "@nestjs/swagger";


@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(public strategy: KeycloakPasswordStrategy) {}

  @Post('login')
  async login(@Req() req) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      throw new BadRequestException('Username and password are required')
    }
    return await this.strategy.login(req.body.username, req.body.password);
  }

  @Get('refresh')
  async refresh(@AccessToken() accessToken: Token) {
    return await this.strategy.refreshToken(accessToken);
  }
}
