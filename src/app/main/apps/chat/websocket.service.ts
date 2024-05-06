import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: any;

  constructor() { }

  connect(callback: (stompClient: any) => void): void {
    const socket = new SockJS('http://localhost:8088/ws');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      console.log('Connected to WebSocket teeeest');
      callback(this.stompClient);
    }, (error:any) => {
      console.error('WebSocket error:', error);
    });
  }

  sendMessage(destination: string, message: any): void {
    if (this.stompClient) {
      if(typeof(message)=='string'){
        this.stompClient.send(destination, {}, JSON.stringify( {message} ));
      }
      else{
        this.stompClient.send(destination, {}, JSON.stringify( message ));
      }
    }
    else {
      console.error('WebSocket connection is not established.');
    }
  }

  subscribe(destination: string, callback: (message: any) => void): void {
    if (this.stompClient) {
      this.stompClient.subscribe(destination, (message:any) => {
        callback(JSON.parse(message.body));
      });
    } else {
      console.error('WebSocket connection is not established.');
    }
  }
}