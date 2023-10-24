import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CLIENT_URL, SERVER_PORT } from "./environments/environments";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: CLIENT_URL,
	});
	await app.listen(SERVER_PORT || 8000);
}
bootstrap();
