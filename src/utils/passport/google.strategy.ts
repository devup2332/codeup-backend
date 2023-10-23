import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	SERVER_HOST,
} from "src/environments/environments";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	constructor() {
		super({
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: `${SERVER_HOST}/auth/google/redirect`,
			scope: ["email", "profile"],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback
	): Promise<void> {
		const { name, emails, photos } = profile;
		const user = {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			picture: photos[0].value,
			accessToken,
			refreshToken,
		};
		done(null, user);
	}
}
