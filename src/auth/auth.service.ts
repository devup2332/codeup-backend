import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuid } from "uuid";
import { User } from "src/entities/User";
import { Repository } from "typeorm";
import { LoginUserDto } from "./dto/LoginUserDto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { environments } from "src/environments/environments";
import { hashPassword } from "src/utils/bcrypt";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserDto, RegisterUserSocialDto } from "./dto/RegisterUserDto";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) private userRepo: Repository<User>,
		private _jwtSrv: JwtService
	) {}
	async loginUser(credentials: LoginUserDto) {
		const { email, password } = credentials;
		const user = await this.userRepo.findOne({
			where: {
				email,
				authType: "form",
			},
		});
		if (!user) {
			return new HttpException("User not found", HttpStatus.NOT_FOUND);
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return new HttpException("Passowrd Incorrect", HttpStatus.UNAUTHORIZED);
		}

		const token = jwt.sign({ email }, environments().JWT_SECRET, {
			expiresIn: 86400,
		});
		return {
			status: 1,
			message: "User logged successfully",
			token,
		};
	}

	async registerUser(data: RegisterUserDto) {
		const { email, firstName, lastName, password } = data;
		const hash = await hashPassword(password);
		const id = uuid();
		const newUser = this.userRepo.create({
			id,
			email,
			password: hash,
			firstName,
			lastName,
			authType: "form",
		});
		await this.userRepo.save(newUser);
		const token = this._jwtSrv.sign({ email });
		return { status: 200, token, message: "User created successfully" };
	}

	async registerUserBySocial({
		email,
		authType,
		picture,
		firstName,
		lastName,
	}: RegisterUserSocialDto) {
		const user = await this.userRepo.findOne({ where: { email } });
		if (user) {
			const token = this._jwtSrv.sign({ email });
			return { token, user };
		}
		const id = uuid();
		const newUser = this.userRepo.create({
			id,
			email,
			authType,
			picture: picture,
			lastName,
			firstName,
		});
		await this.userRepo.save(newUser);
		const token = this._jwtSrv.sign({ email });
		return { token, newUser };
	}

	async validateEmail(email: string) {
		const user = await this.userRepo.findOne({ where: { email } });
		if (user) {
			return { status: 0 };
		}
		return { status: 1 };
	}
}
