export class UserAddDTO{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;  
  linkedinUrl:string;
  description: string;
  birthDay : Date;
  dateEmbauche:Date;

  teamAcronyme: string;
  teamName:string;

  workStatusTest: any;
  workStatus;

  familyStatus:string;
  chatStatus:string;
  
  profilsTest:any;
  profils: Array<string>;

  
}