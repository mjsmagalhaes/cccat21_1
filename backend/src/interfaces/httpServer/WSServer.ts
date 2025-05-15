import { WebSocketServer, WebSocket } from "ws";
import { ConfigService } from "../../service/ConfigService";

export interface WSServer {
    all(message: string, data: any): void;
    // on(message: string, callback: (data: any) => void): void;
}

export class WSServerAdapter implements WSServer {
    server: WebSocketServer;
    connections: WebSocket[] = [];

    constructor(port?: number) {
        this.server = new WebSocketServer({
            port: port ?? ConfigService.getWSPort(),
        });

        this.server.on("connection", (ws) => {
            this.connections.push(ws);

            ws.on("open", () => {
                // debug("New WS Client connected!");
            });

            ws.on("message", (data) => {});

            // orderService.placeOrder.getChannel().subscribe(() => {
            //     debug("New Event: New Order!");
            //     ws.send(JSON.stringify({ message: "New Order!" }));
            // });
        });
    }

    // on(message: string, callback: (data: any) => void): void {
    //     throw new Error("Method not implemented.");
    // }

    all(message: string, data: any): void {
        this.connections.forEach((connection) => {
            connection.send(JSON.stringify({ message, data }));
        });
    }
}
