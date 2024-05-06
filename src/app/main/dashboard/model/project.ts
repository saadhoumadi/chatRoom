export class Project{
    title:string;
    description:string;
    debutDate:Date;
    estimatedEndDate:Date;
    reelEndDate:Date;
    teamAcronyms:Array<string>;
    departments:Array<string>;

    scrumMasterEmail:string;
    managerEmail:string;

    projectStatus:string;
    backlogTitle:string;
    //ajouté pour mesurer la progression des projts en cours done by younes 
    //à revoir par amine pour le reste du front project-service
    progression:number;
}