import { Field, InputType } from "@nestjs/graphql";

/* eslint-disable */
@InputType()
export class CreateUserInput {
	@Field(() => String)
	email: string;

	@Field()
	password: string;

	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	authType: string;
}
