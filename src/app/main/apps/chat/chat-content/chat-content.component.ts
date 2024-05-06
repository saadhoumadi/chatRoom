import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { ChatService } from 'app/main/apps/chat/chat.service';
import { WebsocketService } from '../websocket.service';
import { UserService } from 'app/auth/service';

@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html'
})
export class ChatContentComponent implements OnInit {
  // Decorator
  @ViewChild('scrollMe') scrollMe: ElementRef;
  scrolltop: number = null;

  // Public
  public activeChat: Boolean;
  public chats;
  public chatUser;
  public userProfile;
  public chatMessage = '';
  public newChat;

  newMessage: string = '';

  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(public _chatService: ChatService, private _coreSidebarService: CoreSidebarService,
              private webSocketService: WebsocketService, public userService: UserService
  ) { }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  subscribe() {
    this.webSocketService.subscribe('/user/' + this.userService.userId + '/queue/messages', (message) => {
      // this.messages.push(message);
    });
    this.webSocketService.subscribe('/user/topic/messages', (message) => {
      console.log(message)
      this._chatService.messages.push({
        senderId: message.senderId,
        content: message.content
      });console.log("messages from subscribe: ", this._chatService.messages)
    });
    
  }

  sendMessage() {
    if (this.userService.recipientsId.length != 0) {
      this.sendGroupMessage();
    }
    else {
      if (this.newMessage.trim() !== '') {
        let chatMessage = {
          senderId: this.userService.userId,
          recipientId: this.userService.selectedId,
          content: this.newMessage.trim(),
          timestamp: new Date()
        };
        this.userService.senderId = chatMessage.senderId;
        this.webSocketService.sendMessage('/app/send-message', { message: this.newMessage, sender: this.userService.senderId });
        this.webSocketService.sendMessage("/app/chat", chatMessage);
        console.log("sender:", this.userService.senderId);
        this.newMessage = '';
        // let index = this.combinedList.indexOf(this.selectedId);

        // if (index !== -1) {
        //   // Remove the item from its current position
        //   this.combinedList.splice(index, 1);

        //   // Insert the item at the start
        //   this.combinedList.unshift(this.selectedId);
        // }
      }
    }
    console.log("messages from conteeent: ",this._chatService.messages);
  }

  sendGroupMessage() {
    if (this.newMessage.trim() !== '') {
      let chatGroupMessage = {
        senderId: this.userService.userId,
        recipientsId: this.userService.recipientsId,
        content: this.newMessage.trim(),
        timestamp: new Date()
      };
      this.userService.senderId = chatGroupMessage.senderId;
      this.webSocketService.sendMessage('/app/send-message', { message: this.newMessage, sender: this.userService.senderId });
      this.webSocketService.sendMessage("/app/chatGroup", chatGroupMessage);
      console.log("sender:", this.userService.senderId);
      this.newMessage = '';
      // let index = this.combinedList.indexOf(this.grpId);

      //   if (index !== -1) {
      //     // Remove the item from its current position
      //     this.combinedList.splice(index, 1);

      //     // Insert the item at the start
      //     this.combinedList.unshift(this.grpId);
      //   }
    }
  }

  /**
   * Update Chat
   */
  updateChat() {
    this.newChat = {
      message: this.chatMessage,
      time: 'Mon Dec 10 2018 07:46:43 GMT+0000 (GMT)',
      senderId: this.userProfile.id
    };

    // If chat data is available (update chat)
    if (this.chats.chat) {
      if (this.newChat.message !== '') {
        this.chats.chat.push(this.newChat);
        this._chatService.updateChat(this.chats);
        this.chatMessage = '';
        setTimeout(() => {
          this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
        }, 0);
      }
    }
    // Else create new chat
    else {
      this._chatService.createNewChat(this.chatUser.id, this.newChat);
    }
  }

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to Chat Change
    this._chatService.onChatOpenChange.subscribe(res => {
      this.chatMessage = '';
      this.activeChat = res;
      setTimeout(() => {
        this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
      }, 0);
    });

    // Subscribe to Selected Chat Change
    this._chatService.onSelectedChatChange.subscribe(res => {
      this.chats = res;
    });

    // Subscribe to Selected Chat User Change
    this._chatService.onSelectedChatUserChange.subscribe(res => {
      this.chatUser = res;
      console.log(res)
    });

    this.userProfile = this._chatService.userProfile;
  }
}
