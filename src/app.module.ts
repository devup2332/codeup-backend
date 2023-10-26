import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "./entities/User";
import { JwtModule } from "@nestjs/jwt/dist";
import { UserModule } from "./user/user.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { GoogleStrategy } from "./utils/passport/google.strategy";
import { GithubStrategy } from "./utils/passport/github.strategy";
import environments from "./environments/environments";

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), "src/schema.gql"),
		}),
		AuthModule,
		JwtModule.registerAsync({
			global: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: () => {
				return {
					secret: environments.others.JWT_SECRET,
					signOptions: { expiresIn: 86400 },
				};
			},
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: () => {
				return {
					type: "postgres",
					host: environments.database.DB_HOST,
					port: Number(environments.database.DB_PORT),
					username: environments.database.DB_USERNAME,
					password: environments.database.DB_PASSWORD,
					database: environments.database.DB_NAME,
					entities: [User],
					synchronize: true,
				};
			},
		}),
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService, GoogleStrategy, GithubStrategy],
})
export class AppModule {}
