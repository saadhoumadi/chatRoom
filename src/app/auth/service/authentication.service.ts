import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';
import { UserProfil } from '../models/userProfil';
import { Profil } from '../models/profil';
import { UserService } from './user.service';
import { WebsocketService } from 'app/main/apps/chat/websocket.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  password:any;

  //public
  public currentUser: Observable<User>;
  // public userProfil:Observable<UserProfil>;
  //private
  private currentUserSubject: BehaviorSubject<User>;
  // private userProfilSubject: BehaviorSubject<UserProfil>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService,
              private userService: UserService, private webSocketService: WebsocketService,
              private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    // this.userProfilSubject= new BehaviorSubject<UserProfil>(JSON.parse(localStorage.getItem('userProfil')));
    // this.userProfil = this.userProfilSubject.asObservable();

  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }



  //get roles
  get isManager() {
    return this.currentUser && this.currentUserSubject.value.realProfil == Profil.MANAGER;
  }
  get isTechLead() {
    return this.currentUser && this.currentUserSubject.value.realProfil == Profil.TECH_LEAD;
  }
  get isScrumMaster() {
    return this.currentUser && this.currentUserSubject.value.realProfil == Profil.SCRUM_MASTER;
  }
  get isCollaborator() {
    return this.currentUser && this.currentUserSubject.value.realProfil == Profil.COLLABORATOR;
  }
  /**
   *  Confirms if user is admin
  

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    const input = {
      "email": email,
      "password": password
    }

    this.userService.userId = email;
    this.password=password;
    alert("userId: " + this.userService.userId);

    return this._http
      .post<User>(`${environment.apiIdentityUrl}/user/authenticate`, input)
      .pipe(
        map(response => {
          console.log(response)
          // login successful if there's a jwt token in the response
          if (response && response.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(response));
            // alert(response.message);

            //connect to webSocket
            this.webSocketService.connect(() => {
              this.subscribe(); // Subscribe after connection
            });

            // notify
            this.currentUserSubject.next(response);
          }


          return response;
        })
      );
  }

  subscribe() {
    this.webSocketService.subscribe('/user/topic/messages', (message) => {
      // this.messages.push(message);
      // console.log(message);
    });

    this.webSocketService.subscribe('/user/' + this.userService.userId + '/queue/messages', (message) => {

    })

    this.webSocketService.sendMessage('/app/user.addUser', { nickName: this.userService.userId, fullName: this.password, status: 'ONLINE' })

  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.clear()
    // notify
    this.currentUserSubject.next(null);
  }
}
