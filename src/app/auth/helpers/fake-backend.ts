/**
 *  ? Tip:
 *
 * For Actual Node.js - Role Based Authorization Tutorial with Example API
 * Refer: https://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api
 * Running an Angular 9 client app with the Node.js Role Based Auth API
 */

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Role } from 'app/auth/models';

// Users with role
const users: User[] = [
  {
    id: 1,
    email: 'a',
    password: 'admin',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'avatar-s-11.jpg',
    realProfil: Role.MANAGER,
    birthDay: new Date(), 
    dateEmbauche:new Date(),// Ajout du champ birthDay avec une valeur par défaut (par exemple, la date actuelle)
    mobile: '', // Ajout du champ mobile avec une valeur par défaut (chaîne vide)
    description: '', // Ajout du champ description avec une valeur par défaut (chaîne vide)
    teamAcronyme: '', // Ajout du champ teamAcronyme avec une valeur par défaut (chaîne vide)
    teamName: '', // Ajout du champ teamName avec une valeur par défaut (chaîne vide)
    departmentAcronyme: '', // Ajout du champ departmentAcronyme avec une valeur par défaut (chaîne vide)
    departmentName: '', // Ajout du champ departmentName avec une valeur par défaut (chaîne vide)
    chatStatus: '', // Ajout du champ chatStatus avec une valeur par défaut (chaîne vide)
    familyStatus: '', // Ajout du champ familyStatus avec une valeur par défaut (chaîne vide)
    workStatus: '', // Ajout du champ workStatus avec une valeur par défaut (chaîne vide)
    profils: [], // Ajout du champ profils avec une valeur par défaut (tableau vide)
    lastAuthentication: new Date(), // Ajout du champ lastAuthentication avec une valeur par défaut (par exemple, la date actuelle)
    token: '', // Ajout du champ token avec une valeur par défaut (chaîne vide)
    message: '',
    hasProfilImage:false  ,
    linkedinUrl:"",
    nbrProjectInprogressMonitored:0
}
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(handleRoute));
    // .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    // .pipe(delay(500))
    // .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { email, password } = body;
      const user = users.find(x => x.email === email && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return ok({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.realProfil,
        token: `fake-jwt-token.${user.id}`
      });
    }

    function getUsers() {
      if (!isAdmin()) return unauthorized();
      return ok(users);
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      // only admins can access other user records
      if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

      const user = users.find(x => x.id === idFromUrl());
      return ok(user);
    }

    // helper functions

    function ok(body) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'unauthorized' } });
    }

    function error(message) {
      return throwError({ status: 400, error: { message } });
    }

    function isLoggedIn() {
      const authHeader = headers.get('Authorization') || '';
      return authHeader.startsWith('Bearer fake-jwt-token');
    }

    function isAdmin() {
      return isLoggedIn() && currentUser().realProfil === Role.MANAGER;
    }

    function currentUser() {
      if (!isLoggedIn()) return;
      const id = parseInt(headers.get('Authorization').split('.')[1]);
      return users.find(x => x.id === id);
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
