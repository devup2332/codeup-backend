import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import environments from "./environments/environments";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "warn", "log", "debug"],
		cors: {
			origin: "https://codeup-alpha.vercel.app",
		},
	});
	await app.listen(80, "0.0.0.0");
}
console.log({ environments });
bootstrap();
