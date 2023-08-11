import { Column, PrimaryColumn, Entity } from "typeorm";

@Entity("Users")
export class User {
	@PrimaryColumn({ unique: true })
		id: string;

	@Column({ unique: true })
		email: string;

	@Column({ nullable: true })
		password: string;

	@Column({ type: "boolean", default: true })
		isActive: boolean;

	@Column({ nullable: true, type: "text" })
		picture: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
		createdAt: Date;

	@Column({ type: "varchar" })
		authType: string;

	@Column({ nullable: false })
		firstName: string;

	@Column({ nullable: false })
		lastName: string;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
		updatedAt: Date;
}
