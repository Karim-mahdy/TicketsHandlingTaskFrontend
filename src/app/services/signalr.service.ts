import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection | undefined;

  constructor() {
    this.startConnection();
  }

  public startConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7173/tickethub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.error('Error while starting SignalR connection: ', err));
  }

  public addTicketUpdateListener = (updateTicket: (ticketId: number, color: string) => void) => {
    if (this.hubConnection) {
      this.hubConnection.on('UpdateTicketStatus', (ticketId: number, color: string) => {
        updateTicket(ticketId, color);
      });
    } else {
      console.error('HubConnection is not initialized.');
    }
  }

  public addHandleTicketListener = (handleTicketRealTime: (ticketId: number) => void) => {
    if (this.hubConnection) {
      this.hubConnection.on('HandleTicket', (ticketId: number) => {
        handleTicketRealTime(ticketId);
      });
    } else {
      console.error('HubConnection is not initialized.');
    }
  }
}
