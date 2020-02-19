import {createServer, Server } from 'http';
import express from 'express';
import * as WebSocket from 'ws';

import { MessageModel } from './models/message-model';
import { Socket } from 'dgram';

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

            socket.on('message', (m: any) => {
                const payload: any = JSON.parse(m);

                if (payload.message === 'like') {
                    const message: MessageModel = new MessageModel(
                        payload.message, 
                        payload.data
                    );
                    
                    // Broadcast to other clients...
                    this.io.clients.forEach((client: any) => {
                        if (client != socket) { // All but me
                            console.log(`Send new movie to clients`);
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(message));
                            }
                        }
                    });
                }
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