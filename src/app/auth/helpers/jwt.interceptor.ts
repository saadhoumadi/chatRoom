// import { Injectable, OnInit } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';

// import { environment } from 'environments/environment';
// import { AuthenticationService } from 'app/auth/service';
// import { User } from '../models';

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor,OnInit {
//    public currentUser: Observable<User>;
//    private currentUserSubject: BehaviorSubject<User>;
//   /**
//    *
//    * @param {AuthenticationService} _authenticationService
//    */
//   constructor(private _authenticationService: AuthenticationService) {}
//   ngOnInit(): void {
//       this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
//     this.currentUser = this.currentUserSubject.asObservable();
//   }

//   /**
//    * Add auth header with jwt if user is logged in and request is to api url
//    * @param request
//    * @param next
//    */
//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     ;
//     const isLoggedIn = this.currentUser && this.currentUserSubject.value.token;
//     const isApiUrl = request.url.startsWith(environment.apiIdentityUrl);
//     if (isLoggedIn && isApiUrl) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${this.currentUserSubject.value.token}`
//         }
//       });
//     }

//     return next.handle(request);
//   }
// }
