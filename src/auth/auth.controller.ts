import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";
import { Body, Post, Req, UseGuards } from "@nestjs/common/decorators";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/LoginUserDto";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { RegisterUserDto, RegisterUserSocialDto } from "./dto/RegisterUserDto";
import { CLIENT_URL } from "src/environments/environments";

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

	@Post("/refreshToken")
	refreshToken(@Body() body: { token: string }) {
		const { token } = body;
		return this._authSrv.refreshToken(token);
	}

	@Get("/google")
	@UseGuards(AuthGuard("google"))
	async googleAuthLogin() {
		return HttpStatus.OK;
	}

	@Get("github")
	@UseGuards(AuthGuard("github"))
	async githubAuthLogin() {
		return HttpStatus.OK;
	}

	@Get("github/redirect")
	@UseGuards(AuthGuard("github"))
	async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
		try {
			const { email, picture, firstName } = req.user as any;
			const newUser: RegisterUserSocialDto = {
				email: email,
				picture: picture,
				firstName: firstName,
				authType: "github",
			};
			const { token } = await this._authSrv.authSocialGithubUser(newUser);
			return res.redirect(`${CLIENT_URL}/sso/auth?token=${token}`);
		} catch (err) {
			const urlRedirect = `${CLIENT_URL}/login?code=5561`;
			return res.redirect(urlRedirect);
		}
	}
	@Get("google/redirect")
	@UseGuards(AuthGuard("google"))
	async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
		try {
			const { email, picture, lastName, firstName } = req.user as any;
			const newUser: RegisterUserSocialDto = {
				email: email || "",
				picture: picture || "",
				lastName: lastName || "",
				firstName: firstName || "",
				authType: "google",
			};
			const { token } = await this._authSrv.authSocialGoogleUser(newUser);
			const urlRedirect = `${CLIENT_URL}/sso/auth?token=${token}`;

			return res.redirect(urlRedirect);
		} catch (err) {
			const urlRedirect = `${CLIENT_URL}/login?code=5561`;
			return res.redirect(urlRedirect);
		}
	}
}
