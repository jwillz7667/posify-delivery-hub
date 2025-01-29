@WebSocketGateway()
export class DeliveryGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('trackDelivery')
  handleTrackDelivery(
    @MessageBody() deliveryId: number,
    @ConnectedSocket() client: Socket
  ) {
    // Implement real-time tracking logic
  }

  sendLocationUpdate(deliveryId: number, coordinates: any) {
    this.server.emit(`delivery-${deliveryId}`, coordinates);
  }
} 