import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "src/entities/User";
import { UserService } from "./user.service";

@Resolver()
export class UserResolver {
	constructor(private _userSrv: UserService) {}
	@Query(() => [User])
	async users() {
		return await this._userSrv.getUsers();
	}

	@Mutation(() => [User])
	async deleteUserById(@Args("userId") userId: string) {
		const response = await this._userSrv.getUserById(userId);
		return response || [];
	}
}
