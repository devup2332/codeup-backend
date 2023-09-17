import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";
import { Body, Post, Req, UseGuards } from "@nestjs/common/decorators";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/LoginUserDto";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { RegisterUserDto, RegisterUserSocialDto } from "./dto/RegisterUserDto";

@Controller("/auth")
export class AuthController {
	constructor(private _authSrv: AuthService) {}
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
		return this._authSrv.validateEmail(email);
	}

	@Post("/validateToken")
	validateToken(@Body() body: { token: string }) {
		const { token } = body;
		return this._authSrv.validateToken(token);
	}

	@Get("/google")
	@UseGuards(AuthGuard("google"))
	async googleAuthLogin() {
		return HttpStatus.OK;
	}

	@Get("google/redirect")
	@UseGuards(AuthGuard("google"))
	async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
		const { email, picture, lastName, firstName } = req.user as any;
		const newUser: RegisterUserSocialDto = {
			email,
			picture,
			lastName,
			firstName,
			authType: "social",
		};
		const { token } = await this._authSrv.authSocialUser(newUser);
		return res.redirect(
			`${process.env.CLIENT_URL}/sso/auth?token=${token}`
		);
	}
}
