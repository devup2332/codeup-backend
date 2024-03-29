import { Column, PrimaryColumn, Entity } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";

/* eslint-disable */
@ObjectType()
@Entity("users_tb")
export class User {
	@Field(() => String)
	@PrimaryColumn({ unique: true })
	id: string;

	@Field()
	@Column({ unique: true })
	email: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	password?: string;

	@Field()
	@Column({ type: "boolean", default: true })
	isActive: boolean;

	@Field({ nullable: true })
	@Column({ nullable: true, type: "text" })
	picture?: string;

	@Field()
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@Field()
	@Column({ type: "varchar" })
	authType: string;

	@Field({ nullable: true })
	@Column({ nullable: false })
	firstName?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	lastName?: string;

	@Field()
	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt: Date;
}
