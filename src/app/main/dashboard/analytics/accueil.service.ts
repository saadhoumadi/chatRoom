import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccueilService {

  constructor(private httpClient:HttpClient) { }

   generateUserReport(format:string){
     const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
     const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.post(environment.apiIdentityUrl + "/user/report",format,{ headers: headers,responseType:'text' });
   }

   generateTeamsReport(format:string){
     const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
     const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.post(environment.apiIdentityUrl + "/team/report",format,{ headers: headers,responseType:'text' });
   }

    generateProjectsReport(format:string){
       return this.httpClient.post(environment.apiProjectUrl + "/project/report",format,{responseType:'text'});
   }
   downloadReport(filePath: string): Observable<HttpResponse<Blob>> {
    const token: string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.post(environment.apiIdentityUrl + "/user/report/download", filePath, {
      headers: headers,
      responseType: 'blob', // Spécifiez le type de réponse comme un blob
      observe: 'response' // Permet d'observer la réponse HTTP complète, y compris les en-têtes
    });
  }
}
