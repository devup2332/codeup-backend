import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SERVER_PORT } from "./environments/environments";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: "*",
	});
	await app.listen(SERVER_PORT || 8000);
}
bootstrap();
