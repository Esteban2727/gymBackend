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
  export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer() server: Server;
  
    afterInit(server: Server) {
      console.log('WebSocket Inicializado');
    }
  
    handleConnection(client: Socket) {
      console.log(`Cliente conectado: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Cliente desconectado: ${client.id}`);
    }
  
    // ✅ Emitir evento cuando un producto cambia
    emitProductUpdate() {
      this.server.emit('productUpdated', );
    }
  }
  