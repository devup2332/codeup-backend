import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import environments from "./environments/environments";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "warn", "log", "debug"],
		cors: {
			origin: environments.others.CLIENT_URL,
		},
	});
	await app.listen(environments.others.SERVER_PORT || 8000);
}
console.log({ environments });
bootstrap();
