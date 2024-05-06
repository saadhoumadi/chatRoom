import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'app/auth/service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ChatService } from './chat.service';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'chat-application' },
  providers: [DatePipe],
})
export class ChatComponent implements OnInit {
  // Decorator
  @ViewChild('resultContainer') resultContainer: ElementRef;
  @ViewChild('scrollMe') scrollMe: ElementRef;
  scrolltop: number = null;

  searchText: string = '';
  public userProfile;
  public selectedIndex = null;

  websocket!: WebSocket;
  messages: any[];
  newMessage: string = '';
  stompClient: any;
  users: any

  userId: string;
  selectedId: string;

  recipientsId: string[] = [];
  groupNames: any;

  combinedList: string[] = [];

  grpId: string;

  emails: string[] = [];

  conversationName: string;

  lastMessages: { [key: string]: { content: string; date: Date } } = {};
  unseenMessages: { [key: string]: { [recipient: string]: number } } = {};

  unseenGroupMessages: { [key: string]: { [connectedUser: string]: number } } = {}
  lastGroupMessage: { [key: string]: { content: string; date: Date } } = {};

  groupName: string;
  private hasNewMessages: boolean = false;


  constructor(private webSocketService: WebsocketService, private _coreSidebarService: CoreSidebarService,
    private http: HttpClient, private datePipe: DatePipe,
    private userService: UserService, private modalService: NgbModal) {

    const email: string = JSON.parse(localStorage.getItem("currentUser")).email;

    // this.userId = this.userService.userId;
    this.userId = email;
  }

  ngOnInit(): void {
    this.webSocketService.connect(() => {
      this.subscribe(); // Subscribe after connection
      Promise.all([this.getUseers(), this.getGroupNames()])
        .then(() => {
          this.getLastContent(this.userId);
        })
        .catch((error) => {
          console.error('Error during initialization:', error);
        });
    });

  }

  subscribe() {
    this.webSocketService.subscribe('/user/' + this.userId + '/queue/messages', (message) => {
      // this.messages.push(message);
    });
    this.webSocketService.subscribe('/user/topic/messages', (message) => {
      console.log("frommmm suuub :", message)
      if ((message.senderId === this.userId || message.senderId === this.selectedId) && this.grpId == null && message.recipientId !== null) {
        this.messages.push({
          senderId: message.senderId,
          content: message.content,
          date: new Date()
        });
      }

      this.lastMessages[message.recipientId] = { content: message.content, date: new Date() };

      if (this.userId !== message.senderId) {
        this.getUseers();
        this.hasNewMessages = true;
      }
      if (this.selectedId === message.senderId) {
        this.markMessagesAsSeen(this.selectedId, this.userId);
        this.unseenMessages[this.selectedId][this.userId] = 0;
      }

    });

  }

  sendMessage() {
    if (this.recipientsId.length != 0) {
      this.sendGroupMessage();
    }
    else {
      if (this.newMessage.trim() !== '') {
        let chatMessage = {
          senderId: this.userId,
          recipientId: this.selectedId,
          content: this.newMessage.trim(),
          timestamp: new Date()
        };
        this.userService.senderId = chatMessage.senderId;
        this.webSocketService.sendMessage('/app/send-message', { message: this.newMessage, sender: this.userService.senderId, recipient: chatMessage.recipientId });
        this.webSocketService.sendMessage("/app/chat", chatMessage);
        this.getUnseenMessages(this.selectedId, this.userId);
        this.newMessage = '';
        setTimeout(() => {
          this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
        }, 100);
        let index = this.combinedList.indexOf(this.selectedId);

        if (index !== -1) {
          // Remove the item from its current position
          this.combinedList.splice(index, 1);

          // Insert the item at the start
          this.combinedList.unshift(this.selectedId);
        }
      }
    }
  }

  sendGroupMessage() {
    if (this.newMessage.trim() !== '') {
      let chatGroupMessage = {
        senderId: this.userId,
        recipientsId: this.recipientsId,
        content: this.newMessage.trim(),
        timestamp: new Date()
      };
      this.userService.senderId = chatGroupMessage.senderId;
      this.webSocketService.sendMessage('/app/send-message', { message: this.newMessage, sender: this.userService.senderId });
      this.webSocketService.sendMessage("/app/chatGroup", chatGroupMessage);
      this.newMessage = '';
      setTimeout(() => {
        this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
      }, 100);
      let index = this.combinedList.indexOf(this.grpId);

      if (index !== -1) {
        // Remove the item from its current position
        this.combinedList.splice(index, 1);

        // Insert the item at the start
        this.combinedList.unshift(this.grpId);
      }
    }
  }

  getUseers(): Promise<void> {
    const token: string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`

    });
    return this.http.get<any[]>('http://localhost:8083/identity-service/user/allUsers', { headers: headers }).toPromise().then((users) => {
      this.users = users;
      this.emails = this.users.map((user: any) => user.email);
      this.emails.map((email: any) => {
        this.getUnseenMessages(email, this.userId)
      })
      this.getLastContent(this.userId);
    });
  }

  getGroupNames() {
    this.http.get<any>("http://localhost:8088/allDistinct").subscribe((data) => {
      this.groupNames = data;
      if (!Array.isArray(this.users)) {
        this.users = []; // Default to an empty array if undefined
      }
      // console.log(this.groupNames)
      // this.combinedList = this.groupNames.concat(this.users.map((user: any) => user.email));
      this.groupNames.map((group: any) => {
        this.getUnseenGroupMessages(group, this.userId);
        this.getLastGroupContent(group);
        this.webSocketService.subscribe('/user/' + group + '/queue/messages', (message) => {

          message.recipientsId.push(message.senderId);
          const index = message.recipientsId.indexOf(this.userId);
          if (index !== -1) {
            message.recipientsId.splice(index, 1);
          }

          if ((this.userId === message.senderId && this.grpId !== null) || this.areListsEqual(this.recipientsId, message.recipientsId)) {
            this.messages.push({
              senderId: message.senderId,
              content: message.content,
              date: new Date()
            });
          }
          this.refreshGroups();
          if (this.grpId === group) {
            this.unseenGroupMessages[group][this.userId] = 0;
            this.markMessagesGroupAsSeen(group, this.userId);
            if(this.userId !== message.senderId){
              this.hasNewMessages = true;
            }
          }
          this.lastGroupMessage[group] = { content: message.content, date: new Date() };

        });
      })
    })
  }

  showNewMessages(){
    setTimeout(() => {
      this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
    }, 100);
    this.hasNewMessages = false;
  }

  refreshGroups() {
    this.http.get<any>("http://localhost:8088/allDistinct").subscribe((data) => {
      this.groupNames = data;
      this.groupNames.map((grp: any) => {
        this.getUnseenGroupMessages(grp, this.userId);
      })
    });
  }

  fetchAndDisplayUserchat() {
    this.messages = [];
    this.http.get<any>('http://localhost:8088/messages/' + this.userId + '/' + this.selectedId).subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        const message = data[i];
        const senderId = message.senderId;
        const messageObject = {
          senderId: senderId,
          content: message.content,
          date: message.timestamp
        };
        this.messages.push(messageObject);
      }
    })
  }

  fetchAndDisplayChatGroup() {
    this.messages = [];
    this.http.get<any>('http://localhost:8088/messagesGrp/' + this.userId + '/' + this.recipientsId).subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        const message = data[i];
        const senderId = message.senderId;
        const messageObject = {
          senderId: senderId,
          content: message.content,
          date: message.timestamp
        };
        this.messages.push(messageObject);
      }
    })
  }

  onItemClick(itemId: any) {
    this.selectedId = itemId;
    this.conversationName = itemId;
    this.recipientsId = [];
    this.grpId = null;
    setTimeout(() => {
      this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
    }, 100);
    console.log(this.selectedId)
    if (this.userId && this.selectedId) {
      this.fetchAndDisplayUserchat();
    }
    if (this.unseenMessages[this.selectedId][this.userId] > 0 && this.unseenMessages[this.selectedId][this.userId]) {
      this.unseenMessages[this.selectedId][this.userId] = 0;
      this.markMessagesAsSeen(this.selectedId, this.userId);
    }
  }

  onGroupClick(group: any) {
    this.selectedId = group;
    this.grpId = group;
    this.conversationName = group;
    setTimeout(() => {
      this.scrolltop = this.scrollMe?.nativeElement.scrollHeight;
    }, 100);

    this.http.get<any>('http://localhost:8088/recipients/' + group + '/' + this.userId).subscribe((data) => {
      this.recipientsId = data;
      if (this.recipientsId.length != 0)
        console.log("recipieeeents:", this.recipientsId);
      if (this.userId && this.recipientsId) {
        this.fetchAndDisplayChatGroup();
      }
    })
    if (this.unseenGroupMessages[group][this.userId] > 0 && this.unseenGroupMessages[group][this.userId]) {
      this.unseenGroupMessages[group][this.userId] = 0;
      this.markMessagesGroupAsSeen(group, this.userId);
    }
  }

  areListsEqual(list1: string[], list2: string[]): boolean {
    if (list1.length !== list2.length) {
      return false;
    }

    const sortedList1 = list1.slice().sort();
    const sortedList2 = list2.slice().sort();

    return sortedList1.every((element, index) => element === sortedList2[index]);
  }
  createChatGroupId() {
    console.log(this.recipientsId);
    const formData: FormData = new FormData();
    formData.append('senderId', this.userId);
    formData.append('recipientsId', JSON.stringify(this.recipientsId).replace(/["\[\]]/g, ''));
    formData.append('groupName', this.groupName);
    this.http.post('http://localhost:8088/create', formData).subscribe((data) => {
      console.log(data);
      Swal.fire('Success', 'Votre Group est bien créé!', 'success');
    },
      (error) => {
        console.error('Error creating chat group:', error);
      })
  }

  onSelectionChange(event: any) {
    this.recipientsId = event.map((item: any) => item.email);
  }

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

  async getLastContent(senderId: string): Promise<void> {
    const users = this.users;
    const requests = users.map(user => {
      return this.http.get('http://localhost:8088/lastContent/' + senderId + '/' + user.email, { responseType: 'json' }).toPromise();
    });

    try {
      const responses = await Promise.all(requests);
      responses.forEach((responseArray: unknown[]) => {
        responseArray.forEach(response => {
          console.log(response)
          const responseData = response as { senderId: string, recipientId: string, content: string, timestamp: any };
          if (this.userId === responseData.recipientId) {
            this.lastMessages[responseData.senderId] = { content: responseData.content, date: responseData.timestamp };
          }
          else {
            this.lastMessages[responseData.recipientId] = { content: responseData.content, date: responseData.timestamp };
          }
        });
      });

    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getLastGroupContent(chatId: string): Promise<void> {

    this.http.get('http://localhost:8088/lastGroupContent/' + chatId, { responseType: 'json' }).subscribe((data) => {
      const response = data as { content: string, timestamp: any }
      this.lastGroupMessage[chatId] = { content: response.content, date: response.timestamp };
    })
  }

  getUnseenMessages(senderId: string, recipientId: string) {
    const url = `http://localhost:8088/unseen-messages/${senderId}/${recipientId}`;
    return this.http.get<any>(url).subscribe((data) => {
      // Ensure the outer object is initialized
      if (!this.unseenMessages[senderId]) {
        this.unseenMessages[senderId] = {}; // Initialize if undefined
      }
      // Set the inner key
      this.unseenMessages[senderId][recipientId] = data.length;

    });
  }


  markMessagesAsSeen(senderId: string, recipientId: string) {
    const url = 'http://localhost:8088/mark-seen/' + senderId + '/' + recipientId;
    return this.http.post(url, null).subscribe((data) => {
      console.log(data)
    });
  }

  markMessagesGroupAsSeen(chatId: string, senderId: string) {
    const url = 'http://localhost:8088/markAsSeen/' + chatId + '/' + senderId;
    return this.http.post(url, null).subscribe((data) => {
      console.log("groupAs seen: ", data)
    });
  }

  hasUnseenMessages(senderId: string, recipientId: string): boolean {
    return (
      this.unseenMessages[senderId] && // Outer key exists
      this.unseenMessages[senderId][recipientId] !== undefined // Inner key exists
    );
  }

  hasUnseenGroupMessages(chatId: string, senderId: string): boolean {
    return (
      this.unseenGroupMessages[chatId] && // Outer key exists
      this.unseenGroupMessages[chatId][senderId] !== undefined // Inner key exists
    );
  }

  updateFilteredEmails() {
    const search = this.searchText?.toLowerCase(); // Case-insensitive search
    this.emails = this.emails.filter(email => email?.toLowerCase().includes(search));
    console.log(this.searchText);
  }

  getUnseenGroupMessages(chatId: string, senderId: string) {
    const url = `http://localhost:8088/unseenGroup-messages/${chatId}/${senderId}`;
    return this.http.get<any>(url).subscribe((data) => {
      if (!this.unseenGroupMessages[chatId]) {
        this.unseenGroupMessages[chatId] = {}; // Initialize if undefined
      }
      // Set the inner key
      this.unseenGroupMessages[chatId][senderId] = data.length;
    });
  }

  formatDate(isoDateString: string): string {
    // Parse the ISO date string into a Date object
    const date = new Date(isoDateString);

    // Get the current date
    const now = new Date();

    // Calculate the time difference in hours
    const timeDifference = (now.getTime() - date.getTime()) / (1000 * 60 * 60); // Convert to hours

    if (timeDifference < 24) {
      // If within 24 hours, return only the time
      return this.datePipe.transform(date, 'HH:mm') || '';
    }

    // Otherwise, return only the date in MM/DD/YY format
    return this.datePipe.transform(date, 'dd/MM/yy') || '';
  }

  modalSelectOpen(modalSelect) {
    this.modalService.open(modalSelect, {
      windowClass: 'modal'
    });
  }
}
