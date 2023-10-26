import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import environments from "./environments/environments";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: {
			origin: environments.others.CLIENT_URL,
		},
		logger: ["warn", "error", "debug"],
	});
	await app.listen(environments.others.PORT || 8000, "0.0.0.0", () =>
		console.log(
			`SERVER LISTENING ON PORT ${environments.others.PORT} IN ${process.env.NODE_ENV} MODE`
		)
	);
}
bootstrap();
