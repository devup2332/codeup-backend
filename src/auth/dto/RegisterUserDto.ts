export class RegisterUserDto {
	email: string;
	password: string;
	password_2: string;
	firstName: string;
	lastName: string;
}

export class RegisterUserSocialDto {
	email?: string;
	firstName?: string;
	lastName?: string;
	picture?: string;
	authType?: "form" | "google" | "github";
}

export class RegisterUserSocialGithubDTO {
	username: string;
	picture: string;
	authType: "github";
}
