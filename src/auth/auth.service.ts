import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuid } from "uuid";
import { User } from "src/entities/User";
import { Repository } from "typeorm";
import { LoginUserDto } from "./dto/LoginUserDto";
import * as bcrypt from "bcrypt";

import { hashPassword } from "src/utils/bcrypt";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserDto, RegisterUserSocialDto } from "./dto/RegisterUserDto";
import environments from "src/environments/environments";

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
			return new HttpException(
				"Passowrd Incorrect",
				HttpStatus.UNAUTHORIZED
			);
		}

		const token = this._jwtSrv.sign({ email, userId: user.id });
		return {
			status: 1,
			message: "User logged successfully",
			token,
			userId: user.id,
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
			picture: environments.others.DEFAULT_PHOTO_PROFILE,
			lastName,
			authType: "form",
		});
		await this.userRepo.save(newUser);
		const token = this._jwtSrv.sign({ email, userId: id });
		return {
			status: 200,
			token,
			message: "User created successfully",
			userId: id,
		};
	}

	async authSocialGithubUser({
		authType,
		picture,
		firstName,
		lastName,
		email,
	}: RegisterUserSocialDto) {
		const user = await this.userRepo.findOne({
			where: { email, authType: "github" },
		});
		if (user && user.authType === "github") {
			const token = this._jwtSrv.sign({ email, userId: user.id });
			return { token, user };
		}
		const id = uuid();
		const newUser = this.userRepo.create({
			id,
			authType,
			picture,
			lastName,
			firstName,
			email,
		});
		await this.userRepo.save(newUser);
		const token = this._jwtSrv.sign({ email, userId: id });
		return { token, newUser };
	}
	async authSocialGoogleUser({
		email,
		authType,
		picture,
		firstName,
		lastName,
	}: RegisterUserSocialDto) {
		const user = await this.userRepo.findOne({
			where: { email, authType: "google" },
		});
		if (user) {
			const token = this._jwtSrv.sign({ email, userId: user.id });
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
		const token = this._jwtSrv.sign({ email, userId: id });
		return { token, newUser };
	}

	async validateEmail(email: string) {
		const user = await this.userRepo.findOne({ where: { email } });
		if (user) {
			return { status: 0 };
		}
		return { status: 1 };
	}

	async refreshToken(token: string) {
		const { email, userId } = this._jwtSrv.decode(token) as any;
		const newToken = this._jwtSrv.sign({ email, userId });
		return { status: 1, newToken };
	}

	async validateToken(token: string) {
		try {
			const { email, userId, exp } = this._jwtSrv.decode(token) as any;

			const expired = Date.now() >= exp * 1000;

			return {
				status: email ? 1 : 0,
				expired,
				userId: userId,
			};
		} catch {
			return { status: 0, userId: null };
		}
	}
}
