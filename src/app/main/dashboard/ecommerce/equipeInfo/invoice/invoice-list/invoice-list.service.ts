import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class InvoiceListService implements Resolve<any> {
  rows: any;
  onInvoiceListChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onInvoiceListChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows("syn")]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(acronyme:string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
      this._httpClient.get<any>(environment.apiIdentityUrl + "/team/users/"+acronyme,{ headers: headers }).subscribe((response: any) => {
        this.rows = response;
        this.onInvoiceListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
 deleteUser(email:string){
    const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this._httpClient.delete(environment.apiIdentityUrl + "/user/delete/"+email,{ headers: headers,responseType:'text' });

   }
   
}
