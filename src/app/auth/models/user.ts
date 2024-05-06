import { Role } from './role';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;  
  linkedinUrl:string;
  description: string;
  birthDay : Date;
  dateEmbauche:Date;
  avatar: string;

  teamAcronyme: string;
  teamName:string;

  departmentAcronyme:string;
  departmentName:string;


  chatStatus: string;
  familyStatus: string;
  workStatus: string;
  //nbr de projets en cours suivie for manager profil
   nbrProjectInprogressMonitored:number;

  profils: string[];
  realProfil:string;
  hasProfilImage:boolean;  
  lastAuthentication:Date;
  token?: string;
  message:string;
}
