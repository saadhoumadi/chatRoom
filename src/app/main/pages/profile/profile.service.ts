import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { changeProfilImageDTO } from './models/ChangeProfilImageDTO';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { User } from 'app/auth/models';

@Injectable()
export class ProfileService implements Resolve<any>,OnInit {
  rows: any;
  onPricingChanged: BehaviorSubject<any>;

   public currentUser: Observable<User>;
   private currentUserSubject: BehaviorSubject<User>;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onPricingChanged = new BehaviorSubject({});
  }
  ngOnInit(): void {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/profile-data').subscribe((response: any) => {
        this.rows = response;
        this.onPricingChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
changeProfilImage(input: any): Observable<string> {
    const formData = new FormData();
    formData.append('image', input.image);
    formData.append('firstName', input.firstName);
    formData.append('lastName', input.lastName); 

    const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this._httpClient.post(environment.apiIdentityUrl + "/user/changeProfilImage", formData, { headers: headers, responseType: 'text' });
  }
  deleteProfilImage(email:string):Observable<any>{
     const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
     const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Ajoute l'en-tête d'autorisation Bearer
    });
     return this._httpClient.delete(environment.apiIdentityUrl+"/user/deleteProfilImage/"+email,{ headers: headers,responseType:'text' });
  }
}
