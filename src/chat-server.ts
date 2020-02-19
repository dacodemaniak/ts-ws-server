import {createServer, Server } from 'http';
import express from 'express';
import * as WebSocket from 'ws';

import { MessageModel } from './models/message-model';

export class ChatServer {
    public static readonly PORT:number = 9090;
    private app: express.Application;
    private server: Server;
    private io: any;
    private port: string | number;

    public constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        //const server = createServer(this.app);
        this.io = new WebSocket.Server({ server: this.server });
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connection', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            
            // Try to broadcast a new guest connection message
            let clientNumber: number = 1;
            this.io.clients.forEach((client: any) => {
                console.log(`Broadcast to client ${clientNumber}`);
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify('Hi all, new client [' + clientNumber + '] was connected'));
                }
                clientNumber++;
            });

            socket.on('message', (m: MessageModel) => {
                console.log('[server](message): %s', JSON.stringify(m));
                const response: string = `Says pong to ${JSON.stringify(m)}`;
                socket.send(JSON.stringify(response));
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}