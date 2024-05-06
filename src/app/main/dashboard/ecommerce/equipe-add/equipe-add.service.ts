import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { TeamAddDTO } from './model/TeamAddDTO';
import { environment } from 'environments/environment';

@Injectable()
export class EquipeAddService {
  public apiData: any;
  public onInvoicAddChanged: BehaviorSubject<any>;
  
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onInvoicAddChanged = new BehaviorSubject({});
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
      Promise.all([this.getApiData()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get API Data
   */
  getApiData(): Promise<any[]> {
    const url = `api/invoice-data`;

    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe((response: any) => {
        this.apiData = response;
        this.onInvoicAddChanged.next(this.apiData);
        resolve(this.apiData);
      }, reject);
    });
  }

  getAllDepartment(){
    const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this._httpClient.get(environment.apiIdentityUrl + "/department/all",{ headers: headers });
  }
  addTeam(teamAdd:TeamAddDTO):Observable<any>{
    const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this._httpClient.post<any>(environment.apiIdentityUrl + "/team/add",teamAdd,{ headers: headers });
  }
}
