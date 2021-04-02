import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUser } from './get-user.decorator';
import { AccessTokenInterface } from './interface/accesstoken.interface';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService,
    ) {

    }

    @Post('/signup')
    @UsePipes(ValidationPipe)
    async signUp(
        @Body() authCredentialsDto: AuthCredentialsDto,
    ) {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(
        @Body(ValidationPipe)
            authCredentialsDto: AuthCredentialsDto,
    ): Promise<AccessTokenInterface> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        // console.log('user', user);
        return user;
    }
}
