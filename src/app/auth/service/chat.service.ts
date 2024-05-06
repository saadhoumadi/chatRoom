import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class ChatService {

    messages: any[];
    userChat=false;
    grpChat=false;

    constructor(private httpClient: HttpClient, private userService: UserService) { }

    fetchAndDisplayUserchat() {
        this.messages = [];
        this.httpClient.get<any>('http://localhost:8088/messages/' + this.userService.userId + '/' + this.userService.selectedId).subscribe((data) => {
            for (let i = 0; i < data.length; i++) {
                const message = data[i];
                const senderId = message.senderId;
                const messageObject = {
                    senderId: senderId,
                    content: message.content
                };
                this.messages.push(messageObject);
            }
        })
    }

    fetchAndDisplayChatGroup() {
        this.messages = [];
        this.httpClient.get<any>('http://localhost:8088/messagesGrp/' + this.userService.userId + '/' + this.userService.recipientsId).subscribe((data) => {
            for (let i = 0; i < data.length; i++) {
                const message = data[i];
                const senderId = message.senderId;
                const messageObject = {
                    senderId: senderId,
                    content: message.content
                };
                this.messages.push(messageObject);
            }
        })

    }

}
