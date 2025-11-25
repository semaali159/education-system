/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../User/user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { jwtConstants } from '../config/config.jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/roles.enum';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(
      dto.email,
      dto.password,
      dto.username,
    );

    return {
      message: 'User created successfully, please login',
      userID: user.id,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await this.comparePassword(
      dto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    const roles = this.getUserRoles(user);
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      roles,
      // user.tenantId,
    );
    await this.usersService.updateRefreshToken(
      user.id,
      tokens.refreshToken,
    );
    return tokens;
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
    console.log(userId)
    return { message: 'Logged out successfully' };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const isValid = await this.comparePassword(refreshToken, user.refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    const roles = this.getUserRoles(user);
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      roles,
      // user.tenantId,
    );
    await this.usersService.updateRefreshToken(
      user.id,
      tokens.refreshToken,
    );
    return tokens.accessToken;
  }

  private async generateTokens(
    userId: number,
    email: string,
    roles: Role[],
    // tenantId: string,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, roles },
        {
          secret: jwtConstants.accessSecret,
          expiresIn: jwtConstants.accessExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, roles },
        {
          secret: jwtConstants.refreshSecret,
          expiresIn: jwtConstants.refreshExpiresIn,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
  private getUserRoles(user: any): Role[] {
    return user.roles?.length ? user.roles : [Role.STUDENT];
  }
  private async comparePassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
}
