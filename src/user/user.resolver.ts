import { Query, Resolver } from "@nestjs/graphql";
import { User } from "src/entities/User";
import { UserService } from "./user.service";

@Resolver()
export class UserResolver {
	constructor(private _userSrv: UserService) {}
	@Query(() => [User])
	async users() {
		return await this._userSrv.getUsers();
	}
}
