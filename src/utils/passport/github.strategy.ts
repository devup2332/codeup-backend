import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
	constructor() {
		super({
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: `${process.env.HOST}/auth/github/redirect`,
			scope: ["user:email"],
		});
	}

	async validate(
		accessToken: string,
		_: string,
		profile: any,
		done: any
	): Promise<void> {
		const { displayName, emails, photos } = profile;
		const user = {
			email: emails[0].value,
			firstName: displayName,
			picture: photos[0].value,
			accessToken,
		};
		done(null, user);
	}
}
