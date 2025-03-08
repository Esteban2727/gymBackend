import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  
  @WebSocketGateway({ cors: true })
  export class SocketGateway implements  OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
     server: Server;
  
 
  
    handleConnection(client: Socket) {
      console.log(`Cliente conectado: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Cliente desconectado: ${client.id}`);
    }
  
    
    emitProductUpdate() {
      this.server.emit('productUpdated', );
    }
  }
  