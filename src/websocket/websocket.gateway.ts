import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit, SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ParticipantDto } from './dto/participant.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private readonly server: Server;

  private readonly logger: Logger = new Logger('WebsocketGateway');

  sendEvent(event: string, data: any) {
    this.server.emit(event, data);
  }

  @SubscribeMessage('new-participant')
  handleNewParticipant(client: Socket, participant: ParticipantDto) {
    // client.broadcast.emit('new-participant', participant); // todos menos o que enviou
    this.sendEvent('new-participant', { ...participant, socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    this.sendEvent('participant-left', client.id);
    this.logger.log(`Cliente desconectado - ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado - ${client.id}`);
  }

  afterInit() {
    this.logger.log(`Websocket Server iniciou com sucesso 🎉`);
  }

}
