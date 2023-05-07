import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";
import { Body, Post, Req, UseGuards } from "@nestjs/common/decorators";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/LoginUserDto";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { RegisterUserDto } from "./dto/RegisterUserDto";

@Controller("/auth")
export class AuthController {
	constructor(
		private _authSrv: AuthService,
	) {}
	@Post("/login")
	loginUser(@Body() body: LoginUserDto) {
		return this._authSrv.loginUser(body);
	}

	@Post("/register")
	registerUser(@Body() body: RegisterUserDto) {
		return this._authSrv.registerUser(body);
	}

	@Get("/validateEmail/:email")
	validateEmail(@Param("email") email: string) {
		console.log(email);
		return this._authSrv.validateEmail(email);
	}

	@Get("google/login")
	@UseGuards(AuthGuard("google"))
	async googleAuth() {
		return HttpStatus.OK;
	}

	@Get("google/redirect")
	@UseGuards(AuthGuard("google"))
	async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
		const { email, picture, lastName, firstName } = req.user as any;
		const newUser = {
			email,
			picture,
			lastName,
			firstName,
			authType: "social",
		};
		const { token } = await this._authSrv.registerUserBySocial(newUser);
		const rtoken = token.replace(".", "-").replace(".", "-");
		console.log({ rtoken, token });
		return res.redirect(`http://localhost:3000/sso/auth/${rtoken}`);
	}
}
