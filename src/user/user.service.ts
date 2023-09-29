import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/User";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
	async getUserById(userId: string) {
		return (await this.userRepo.findOne({ where: { id: userId } })) || [];
	}

	async getUsers() {
		const users = await this.userRepo.find();
		return users;
	}
}
