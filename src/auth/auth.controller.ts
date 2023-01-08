import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign_up')
  signUp(@Body() createUserDto: createUserDto): Promise<void> {
    return this.authService.createUser(createUserDto);
  }

  @Post('/sign_in')
  async signIp(@Body() createUserDto: createUserDto): Promise<string> {
    const { accessToken } = await this.authService.validationUser(
      createUserDto,
    );
    return accessToken;
  }
  // jwt test
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
