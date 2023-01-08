import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user-dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: createUserDto): Promise<void> {
    const { username, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPasswd = await bcrypt.hash(password, salt);

    try {
      const user = this.authRepository.create({
        username,
        password: hashedPasswd,
      });
      await this.authRepository.save(user);
    } catch (error) {
      console.log(error.code);
      // dupli err code
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('user already exist');
      } else {
        throw new InternalServerErrorException('err occ');
      }
    }
  }

  async validationUser(
    createUserDto: createUserDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = createUserDto;
    const user = await this.authRepository.findOne({ where: { username } });
    // compare passwrod
    const compare = await bcrypt.compare(password, user.password);
    if (user && compare) {
      // token generate
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('check your login credentials');
    }
  }
}
