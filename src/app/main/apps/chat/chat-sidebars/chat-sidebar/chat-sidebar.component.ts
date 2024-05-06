import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { ChatService } from 'app/main/apps/chat/chat.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'app/auth/service';
import { WebsocketService } from '../../websocket.service';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html'
})
export class ChatSidebarComponent implements OnInit {
  // Public
  public contacts;
  public chatUsers;
  public searchText;
  public chats;
  public selectedIndex = null;
  public userProfile;
  public users:any
  userId:any
  messages:any
  groupNames: any;

  combinedList: string[] = [];

  /**
   * Constructor
   *
   * @param {ChatService} _chatService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _chatService: ChatService, private _coreSidebarService: CoreSidebarService,
              private http: HttpClient, private userService: UserService,
              private webSocketService: WebsocketService,
  ) {
    this.userId=this.userService.userId;
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open Chat
   *
   * @param id
   * @param newChat
   */
  openChat(id) {
    this._chatService.openChat(id);

    // Reset unread Message to zero
    // this.chatUsers.map(user => {
    //   if (user.id === id) {
    //     user.unseenMsgs = 0;
    //   }
    // });
  }

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Set Index
   *
   * @param index
   */
  setIndex(index: number) {
    this.selectedIndex = index;
  }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.getUsers();

    setTimeout(()=>{this.getGroupNames();
    },0)


    // Subscribe to selected Chats
    this._chatService.onSelectedChatChange.subscribe(res => {
      this.chats = res;
    });

    // Add Unseen Message To Chat User
    this._chatService.onChatsChange.pipe(first()).subscribe(chats => {
      chats.map(chat => {
        this.chatUsers.map(user => {
          if (user.id === chat.userId) {
            user.unseenMsgs = chat.unseenMsgs;
          }
        });
      });
    });

    // Subscribe to User Profile
    this._chatService.onUserProfileChange.subscribe(response => {
      this.userProfile = response;
    });
  }
  

  getUsers() {
    const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
      
    });
    this.http.get<any>('http://localhost:8083/identity-service/user/allUsers',{headers: headers}).subscribe((data) => {
      this.users = data;
      console.log(data);
    })
  }

  getChats(){
    this.http.get<any>('http://localhost:8088/messages/Saad@DXC.com/Hajar@DXC.com').subscribe((data)=>{
      this.messages=data;
      console.log(data)
    })
  }

  getGroupNames() {
    this.http.get<any>("http://localhost:8088/allDistinct").subscribe((data) => {
      this.groupNames = data;
      console.log(this.groupNames)
      this.combinedList = this.groupNames.concat(this.users.map((user: any) => user.email));
      console.log(this.combinedList)
    })
  }

  onItemClick(itemId: any) {
    this.userService.selectedId = itemId;
    this.userService.recipientsId = [];
    console.log(this.userService.selectedId)
    if (this.userService.userId && this.userService.selectedId) {
      this.fetchAndDisplayUserchat();
      console.log("display useeeerChat");
      this._chatService.userChat=true;
      this._chatService.grpChat=false;
      this._chatService.activeChat=true;
    }
  }

  onGroupClick(group: any) {
    this.userService.grpId = group;
    this.webSocketService.subscribe('/user/' + group + '/queue/messages', (message) => {
      // this.messages.push(message);
    });
    this.http.get<any>('http://localhost:8088/recipients/' + group + '/' + this.userService.userId).subscribe((data) => {
      this.userService.recipientsId = data;
      if (this.userService.recipientsId.length != 0)
        console.log("recipieeeents:", this.userService.recipientsId);
      if (this.userService.userId && this.userService.recipientsId) {
        this.fetchAndDisplayChatGroup();
        console.log("display GrouuupChat");
        this._chatService.grpChat=true;
        this._chatService.userChat=false;
        this._chatService.activeChat=true;
      }
    })
  }

  fetchAndDisplayUserchat() {
    this.messages = [];
    this._chatService.messages=[];
    this.http.get<any>('http://localhost:8088/messages/' + this.userService.userId + '/' + this.userService.selectedId).subscribe((data) => {
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
    this._chatService.messages=this.messages;
    this._chatService.recupereChats=this.messages;
    console.log("messages from serviice: ",this.messages)
}

fetchAndDisplayChatGroup() {
    this.messages = [];
    this._chatService.messages=[];
    this.http.get<any>('http://localhost:8088/messagesGrp/' + this.userService.userId + '/' + this.userService.recipientsId).subscribe((data) => {
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
    this._chatService.messages=this.messages;
    this._chatService.recupereChats=this.messages;
}
}
