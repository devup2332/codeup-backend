import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(private _userSrv: UserService) {}
	@Get(":userId")
	fetUserById(@Param("userId") userId: string) {
		return this._userSrv.getUserById(userId);
	}
}
