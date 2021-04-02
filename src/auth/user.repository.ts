import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from './user.entity'
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredentials: AuthCredentialsDto) {

        // const user = new User();
        const user = this.create();
        user.username = authCredentials.username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(authCredentials.password, user.salt);

        try {
            // console.log('save', user);
            await user.save();
        } catch (error) {
            // console.log('error', error);
            if (error.code === '23505') {
                // 23505 duplicate username
                throw new ConflictException('Username already exists.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUsernamePassword(
        authCredentials: AuthCredentialsDto,
    ): Promise<string> {
        const user = await this.findOne({username: authCredentials.username});

        if (user && (await user.validatePassword(authCredentials.password))) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}