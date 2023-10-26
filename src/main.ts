import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import environments from "./environments/environments";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(environments.others.SERVER_PORT, "0.0.0.0");
}
console.log({ environments });
bootstrap();
