import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { environments } from "./environments/environments";
import { User } from "./entities/User";
import { JwtModule } from "@nestjs/jwt/dist";
import { GoogleStrategy } from "./utils/passport/googlestrategy";

@Module({
	imports: [
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
					type: "mysql",
					host: confSrv.get("DB_HOST"),
					port: 3306,
					username: confSrv.get("DB_USERNAME"),
					password: confSrv.get("DB_PASSWORD"),
					database: confSrv.get("DB_NAME"),
					ssl: {},
					entities: [User],
					synchronize: true,
				};
			},
		}),
	],
	controllers: [AppController],
	providers: [AppService, GoogleStrategy],
})
export class AppModule {}
