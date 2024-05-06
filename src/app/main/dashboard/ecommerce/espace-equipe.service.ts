import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/auth/models';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspaceEquipeService {
  public pipe = new DatePipe('en-US');

  constructor(private httpClient:HttpClient) {
   }
   //helpers
formatDate(date: Date): string {
  const formattedDate: string = this.pipe.transform(date, 'yyyy-MM-dd');
  return formattedDate;
}
   getAllTeamsOfDepartment(departmentAcronyme:string):Observable<any>{
    const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.get<any>(environment.apiIdentityUrl + "/department/teams/"+departmentAcronyme,{ headers: headers });
   }
   calculateNumberOfCollabortorsOfDepartmnt(departmentAcronyme:string):Observable<string>{
    const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.get(environment.apiIdentityUrl + "/department/numberOfCollaborators/"+departmentAcronyme,{ headers: headers, responseType:'text' });
   }
   getAllUsersOfTeam(acronyme:string):Observable<any>{
    const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.get<any>(environment.apiIdentityUrl + "/team/users/"+acronyme,{ headers: headers });
   }
   getTechLeadOfTeam(acronyme:string){
    const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.get<any>(environment.apiIdentityUrl + "/team/techLead/"+acronyme,{ headers: headers });
   }
   getAllManagersOfDepartment(departmentAcronym:string){
     const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
     const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
     });
        return this.httpClient.get<any>(environment.apiIdentityUrl + "/department/managers/"+departmentAcronym,{ headers: headers });
    }
   deleteTeam(acronyme:string){
     const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
     const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.delete(environment.apiIdentityUrl + "/team/delete/"+acronyme,{ headers: headers,responseType:'text' });
   }
   generateTeamsReport(format:string){
     const token:string = JSON.parse(localStorage.getItem("currentUser")).token;
     const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.httpClient.post(environment.apiIdentityUrl + "/team/report",format,{ headers: headers,responseType:'text' });
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


   // u can copy it and reuse it into project service  !
   getAllProjectsOfdepartment(departmentAcronyme:string){
    return this.httpClient.get<any>(environment.apiProjectUrl + "/project/all/department/"+departmentAcronyme.toLowerCase());
   }
   getAllProjectsOfTeam(teamAcronyme:string){
        return this.httpClient.get<any>(environment.apiProjectUrl + "/project/all/team/"+teamAcronyme.toLowerCase());
   }
   getCurrentProjectDetailsOfTeam(teamAcronyme:string){
     return this.httpClient.get<any>(environment.apiProjectUrl + "/project/currentProject/"+teamAcronyme.toLowerCase());
   }
   getSentimentEntredTodayOfTeam(teamAcronyme:string){
     const today:Date=new Date()
     return this.httpClient.get<any>(environment.apiProjectUrl + `/sentiment/getSentimentsOfTeamByDate?teamAcronyme=${teamAcronyme}&date=${this.formatDate(today)}`);
   }
    getSentimentEntredTodayOfDepartment(departmentAcronyme:string){
     const today:Date=new Date()
     return this.httpClient.get<any>(environment.apiProjectUrl + `/sentiment/getSentimentsOfDepartmentByDate?departmentAcronyme=${departmentAcronyme.toLowerCase()}&date=${this.formatDate(today)}`);
   }
   getSentimentOfUserToday(email:string){
     const today:Date=new Date()  
     return this.httpClient.get<any>(environment.apiProjectUrl + `/sentiment/getSentimentOfUserByDate?email=${email.toLowerCase()}&date=${this.formatDate(today)}`);
   }
   getAllTasksOfuserInCurrentSprint(email:string){
     return this.httpClient.get<any>(environment.apiProjectUrl + `/task/all/currentSprint?email=${email}`);
   }
   getAllTaskToDoTodayOfUser(email:string){
         const today:Date=new Date()  
         return this.httpClient.get<any>(environment.apiProjectUrl + `/task/all/toDoByDate?email=${email}&date=${this.formatDate(today)}`);
   }
   getCurrentSprintOfTeam(teamAcronym:string){
       return this.httpClient.get<any>(environment.apiProjectUrl + `/sprint/current?teamAcronym=${teamAcronym}`);
   }
   getProjectEndingSoonOfdepartment(departmentAcronyme:string){
        const formattedDepartmntAcronym=departmentAcronyme.toLowerCase()
        return this.httpClient.get<any>(environment.apiProjectUrl + `/project/endSoon?departmentAcronym=${formattedDepartmntAcronym}`);
   
   }
   getAllFunctionalityOfProject(backlogTitle:string){
     return this.httpClient.get<any>(environment.apiProjectUrl + `/functionality/allByBacklog?title=${backlogTitle}`);
   }
}
