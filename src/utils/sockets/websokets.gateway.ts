import {
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	WebSocketServer,
	ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway(8001, { cors: { origin: "*" } })
export class AuthGateway implements OnGatewayConnection, OnGatewayInit {
	@WebSocketServer() server: Server;
	socket: Socket;
	id: string;

	afterInit(@ConnectedSocket() socket: Socket) {
		this.socket = socket;
	}

	handleConnection(client: any) {
		this.id = client.client.id;
	}
}
