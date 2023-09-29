import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { environments } from "./environments/environments";
import { User } from "./entities/User";
import { JwtModule } from "@nestjs/jwt/dist";
import { UserModule } from "./user/user.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { GoogleStrategy } from "./utils/passport/google.strategy";
import { GithubStrategy } from "./utils/passport/github.strategy";

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), "src/schema.gql"),
		}),
		AuthModule,
		ConfigModule.forRoot({
			load: [environments],
		}),
		JwtModule.registerAsync({
			global: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (confSrv: ConfigService) => {
				return {
					secret: confSrv.get("JWT_SECRET"),
					signOptions: { expiresIn: 86400 },
				};
			},
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (confSrv: ConfigService) => {
				return {
					type: "postgres",
					host: confSrv.get("DB_HOST"),
					port: confSrv.get("DB_PORT"),
					username: confSrv.get("DB_USERNAME"),
					password: confSrv.get("DB_PASSWORD"),
					database: confSrv.get("DB_NAME"),
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
