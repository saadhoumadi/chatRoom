import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { first } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';

import { colors } from 'app/colors.const';
import { User } from 'app/auth/models';
import { UserService } from 'app/auth/service';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import { AccueilService } from './accueil.service';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { EspaceEquipeService } from '../ecommerce/espace-equipe.service';
import { Project } from '../model/project';
import { Sprint } from '../model/sprint';
import { Functionality } from '../model/Functionality';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnalyticsComponent implements OnInit {
  // Decorator
  @ViewChild('gainedChartRef') gainedChartRef: any;
  @ViewChild('orderChartRef') orderChartRef: any;
  @ViewChild('avgSessionChartRef') avgSessionChartRef: any;
  @ViewChild('supportChartRef') supportChartRef: any;
  @ViewChild('salesChartRef') salesChartRef: any;

  // Public
  public projetEncours:Project;
  public sentimentStatus:string;

  public data: any;
  public currentUser: User;
  public loading = false;
  public users: User[] = [];
  public gainedChartoptions;
  public orderChartoptions;
  public avgsessionChartoptions;
  public supportChartoptions;
  public salesChartoptions;
  public isMenuToggled = true;

    private filePathUserReport="C:\\Users\\pc\\Desktop\\DXCsynergy\\reports\\usersReport.pdf"
    private filePathTeamReport="C:\\Users\\pc\\Desktop\\DXCsynergy\\reports\\teamsReport.pdf"
    private filePathProjectReport="C:\\Users\\pc\\Desktop\\DXCsynergy\\reports\\projectsReport.pdf"

    private tasksOfUser:Array<Task>=[];
    public totalTask:number=0;

    private tasksOfUserFinished:Array<Task>=[];
    public numberTasksFinished:number=0;

    private tasksOfUserInProgress:Array<Task>=[];
    public numberTasksInProgress:number=0;

    private tasksOfUserToDo:Array<Task>=[];
    public numberTasksToDo:number=0;

    private tasksOfUserTodoToday:Array<Task>=[];
    public numbertasksOfUserTodoToday:number=0;

    public currentSprint:Sprint;
    public delaiFinCurrentSprint:number;
    public colleguesOfUser:Array<User>=[];

    public projectEndSoon:Project;
    public functionalitiesOfEndSoonProject:Array<Functionality>=[];
    public totalFunctionalityOfProjectEndSoon:number;
    public numberFinishedFunctionalityOfProjectEndSoon:number=0;
    public functionalityNotImplementedInProjectEndSoonTop5:Array<Functionality>=[];
    public numberTODOFunctionalityOfProjectEndSoon:number=0;


    public tasksSupportData:any;
    public functionnalitySupportData:any;
  // Private
  private $primary = '#7367F0';
  private $warning = '#FF9F43';
  private $info = '#00cfe8';
  private $info_light = '#1edec5';
  private $strok_color = '#b9c3cd';
  private $label_color = '#e7eef7';
  private $white = '#fff';
  private $textHeadingColor = '#5e5873';
  public pipe = new DatePipe('en-US');
  public today:Date=new Date()

  /**
   * Constructor
   *
   * @param {UserService} _userService
   * @param {DashboardService} _dashboardService
   * @param {CoreConfigService} _coreConfigService
   *
   */
  constructor(
    private accueilService:AccueilService,
    public espaceEquipeService:EspaceEquipeService,
    private _userService: UserService,
    private _dashboardService: DashboardService,
    private _coreConfigService: CoreConfigService
  ) {
    // Subscribers Gained chart
    this.gainedChartoptions = {
      chart: {
        height: 100,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      colors: [this.$primary],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 80, 100]
        }
      },
      tooltip: {
        x: { show: false }
      }
    };

    // Order Received Chart
    this.orderChartoptions = {
      chart: {
        height: 100,
        type: 'area',
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      colors: [this.$warning],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.9,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 80, 100]
        }
      },
      series: [
        {
          name: 'Orders',
          data: [10, 15, 8, 15, 7, 12, 8]
        }
      ],
      tooltip: {
        x: { show: false }
      }
    };

    // Average Session Chart
    this.avgsessionChartoptions = {
      chart: {
        type: 'bar',
        height: 200,
        sparkline: { enabled: true },
        toolbar: { show: false }
      },
      colors: [
        this.$label_color,
        this.$label_color,
        this.$primary,
        this.$label_color,
        this.$label_color,
        this.$label_color
      ],
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          endingShape: 'rounded'
        }
      },
      tooltip: {
        x: { show: false }
      }
    };

    // Support Tracker Chart
  

    // Sales Chart
    this.salesChartoptions = {
      chart: {
        height: 330,
        type: 'radar',
        dropShadow: {
          enabled: true,
          blur: 8,
          left: 1,
          top: 1,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: 0
      },
      colors: [this.$primary, this.$info],
      plotOptions: {
        radar: {
          polygons: {
            connectorColors: 'transparent'
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#9f8ed7', this.$info_light],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 0
      },
      legend: {
        show: false
      },
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      dataLabels: {
        style: {
          colors: [
            this.$strok_color,
            this.$strok_color,
            this.$strok_color,
            this.$strok_color,
            this.$strok_color,
            this.$strok_color
          ]
        }
      },
      yaxis: {
        show: false
      }
    };
  }
refreshPage(){
    window.location.reload();
 }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // get the currentUser details from localStorage
    
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loading = true;
    this._userService
      .getAll()
      .pipe(first())
      .subscribe(users => {
        this.loading = false;
        this.users = users;
      });
    // Get the dashboard service data
    this._dashboardService.onApiDataChanged.subscribe(response => {
      this.data = response;
    });
    this.getCurrentProjectOfUser();
    this.getSentimentOfUserToday();
    this.getAllTasksOfUserInCurrentSprint()
    this.getAllTasksToDoOfUserToday()
    this.getCurrentSprintOfTeam();
    this.getColleguesOfUser();
    this.getProjectEndSoonOfManager();
  }
 calculerTempsEcoule(dateDerniereConnexion: Date): string {
    const derniere = new Date(dateDerniereConnexion);
    const maintenant = new Date();

    const difference = maintenant.getTime() - derniere.getTime();
    const seconds = Math.floor(difference / 1000); // Conversion de millisecondes en secondes
    const minutes = Math.floor(seconds / 60);
    const heures = Math.floor(minutes / 60);
    const jours = Math.floor(heures / 24);
    const mois = Math.floor(jours / 30);
    const annees = Math.floor(mois / 12);

    if (annees > 0) {
      return `${annees} an${annees > 1 ? 's' : ''} et ${mois % 12} mois`;
    } else if (mois > 0) {
      return `${mois} mois et ${jours % 30} jour${jours % 30 > 1 ? 's' : ''}`;
    } else if (jours > 0) {
      return `${jours} jour${jours > 1 ? 's' : ''} et ${heures % 24} heure${heures % 24 > 1 ? 's' : ''}`;
    } else if (heures > 0) {
      return `${heures} heure${heures > 1 ? 's' : ''} et ${minutes % 60} minute${minutes % 60 > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  }

  formatDate(date:Date):string{
       const formattedDate:string=this.pipe.transform(date, 'dd/MM/yyyy');
       return formattedDate;
}
formatDateAdvanced(date:Date){
  const formattedDate= this.pipe.transform(date,'dd MMM,yy')
  return formattedDate;
}

  
  generateUserReport(): void {
    const format = 'pdf'; 
    this.accueilService.generateUserReport(format).subscribe((response: any) => {
      this.downloadReport(this.filePathUserReport,"usersReport");
    });
  }
   generateTeamsReport(): void {
    const format = 'pdf'; 
    this.accueilService.generateTeamsReport(format).subscribe((response: any) => {
      this.downloadReport(this.filePathTeamReport,"teamsReport");
    });
  }
   generateProjectReport(): void {
    const format = 'pdf'; 
    this.accueilService.generateProjectsReport(format).subscribe((response: any) => {
      this.downloadReport(this.filePathProjectReport,"projectsReport");
    });
  }
  getCurrentProjectOfUser(){
     this.espaceEquipeService.getAllProjectsOfTeam(this.currentUser.teamAcronyme).subscribe(
      {
         next: (projects) => {
          console.log("projet en cours")
          console.log(projects)
        
          this.projetEncours=projects.filter(projet=>projet.projectStatus=="IN_PROGRESS")[0];
          console.log("projet en cours");
          console.log(this.projetEncours)
       
      },
      error: (error) => {
        console.log('Error searching users:', error);
      }
      }
     )
  }
  getSentimentOfUserToday(){
    this.espaceEquipeService.getSentimentOfUserToday(this.currentUser.email).subscribe(
      {
        next:(sentiment)=>{
            this.sentimentStatus=sentiment.feelingStatus;
            console.log("sentiment staus "+this.sentimentStatus)
        }
      }
    )
  }
  getAllTasksOfUserInCurrentSprint(){
    this.espaceEquipeService.getAllTasksOfuserInCurrentSprint(this.currentUser.email).subscribe(
      {
        next:(tasks)=>{
            console.log("tasks of current sprint ")
            console.log(tasks)
            this.tasksOfUser=tasks;
            this.totalTask=this.tasksOfUser.length;

            this.tasksOfUserFinished=tasks.filter(task=>task.taskStatus=="FINISHED")
            this.numberTasksFinished=this.tasksOfUserFinished.length;
            console.log("tasks finished ")
            console.log(this.tasksOfUserFinished)

            this.tasksOfUserInProgress=tasks.filter(task=>task.taskStatus=="IN_PROGRESS")
            this.numberTasksInProgress=this.tasksOfUserInProgress.length;
            console.log("tasks in progress")
            console.log(this.tasksOfUserInProgress)

            this.tasksOfUserToDo=tasks.filter(task=>task.taskStatus=="TO_DO")
            this.numberTasksToDo=this.tasksOfUserToDo.length;
            console.log("tasks to do")
            console.log(this.tasksOfUserToDo)

            const avgTasksFinished= (this.numberTasksFinished/this.totalTask *100).toFixed(0);
            this.tasksSupportData={
      series: [avgTasksFinished],
      analyticsData: {
        total: this.totalTask,
        toDo: this.numberTasksToDo,
        finished: this.numberTasksFinished,
        inProgress: this.numberTasksInProgress,
        responseTime: '1d'
      }
    }
        }
      }
    )
    this.initializeTaskGraph();

  }
  getAllTasksToDoOfUserToday(){
    this.espaceEquipeService.getAllTaskToDoTodayOfUser(this.currentUser.email).subscribe(
      {
        next:(tasks)=>{
          console.log("tasks to do today are")
          console.log(tasks)
          this.tasksOfUserTodoToday=tasks;
          this.numbertasksOfUserTodoToday=this.tasksOfUserTodoToday.length;

        }
      }
    )
  }
   getCurrentSprintOfTeam(){
     this.espaceEquipeService.getCurrentSprintOfTeam(this.currentUser.teamAcronyme).subscribe(
      {
        next:(sprint)=>{
          console.log("sprint en cours")
          console.log(sprint)
          this.currentSprint=sprint;
          this.delaiFinCurrentSprint=this.calculerdelai(this.currentSprint.endDate);
        }
      }
    )
   }
   getColleguesOfUser(){
      this.espaceEquipeService.getAllUsersOfTeam(this.currentUser.teamAcronyme).subscribe(
        {
          next:(users)=>{
              
              this.colleguesOfUser=users.slice(0,5);
              console.log("collegues of users");
              console.log(this.colleguesOfUser);
          }
        }
      )
   }
   //for Of its department
   getProjectEndSoonOfManager(){
     this.espaceEquipeService.getProjectEndingSoonOfdepartment(this.currentUser.departmentAcronyme).subscribe(
        {
          next:(project)=>{
              console.log("project end soo should be delivered");
              console.log(project)
              this.projectEndSoon=project;
              console.log("project title end soon is "+this.projectEndSoon.title)
              this.getAllFunctionalityOfProjectEndSoon();

          }
        }
      )
   }
   getAllFunctionalityOfProjectEndSoon(){
     this.espaceEquipeService.getAllFunctionalityOfProject(this.projectEndSoon.backlogTitle).subscribe(
        {
          next:(functionalities)=>{
              console.log("all functionalities of project ending soon");
              console.log(functionalities);
              this.functionalitiesOfEndSoonProject=functionalities;
              this.totalFunctionalityOfProjectEndSoon=this.functionalitiesOfEndSoonProject.length;
              this.numberFinishedFunctionalityOfProjectEndSoon=this.functionalitiesOfEndSoonProject.filter(functionality=>functionality.state=="FINISHED").length;
              this.numberTODOFunctionalityOfProjectEndSoon=this.functionalitiesOfEndSoonProject.filter(functionality=>functionality.state=="TO_DO").length;
              this.functionalityNotImplementedInProjectEndSoonTop5=this.functionalitiesOfEndSoonProject.filter(functionality=>functionality.state=="TO_DO").slice(0,6);
              
              this.functionalityNotImplementedInProjectEndSoonTop5.sort((a, b) => {
    if (a.priority === "HIGH") {
      return -1; // a avant b (High avant Medium et Low)
    } else if (a.priority === "MEDIUM") {
      if (b.priority === "HIGH") return 1; // b avant a (High avant Medium)
      else return -1; // a avant b (Medium avant Low)
    } else {
      return 1; // b avant a (Low après tout)
    }
  });
  console.log("functionnality not implemented are order by priority ")
  console.log(this.functionalityNotImplementedInProjectEndSoonTop5);
              
              const avgFinishedFunctionality=((this.numberFinishedFunctionalityOfProjectEndSoon/this.totalFunctionalityOfProjectEndSoon)*100).toFixed(0)
              this.functionnalitySupportData={
      series: [avgFinishedFunctionality],
      analyticsData: {
        total: this.totalTask,
        toDo: this.numberTasksToDo,
        finished: this.numberTasksFinished,
        inProgress: this.numberTasksInProgress,
        responseTime: '1d'
      }
               }

          }
        }
      )
      this.initializeFunctionalityGraph()
   }


  initializeTaskGraph(){
      this.supportChartoptions = {
      chart: {
        height: 290,
        type: 'radialBar',
        sparkline: {
          enabled: false
        }
      },
      plotOptions: {
        radialBar: {
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '65%'
          },
          track: {
            background: this.$white,
            strokeWidth: '100%'
          },
          dataLabels: {
            name: {
              offsetY: -5,
              color: this.$textHeadingColor,
              fontSize: '1rem'
            },
            value: {
              offsetY: 15,
              color: this.$textHeadingColor,
              fontSize: '1.714rem'
            }
          }
        }
      },
      colors: [colors.solid.danger],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [colors.solid.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        dashArray: 8
      },
      labels: ['Accomplies']
    };
  }
   initializeFunctionalityGraph(){
      this.supportChartoptions = {
      chart: {
        height: 290,
        type: 'radialBar',
        sparkline: {
          enabled: false
        }
      },
      plotOptions: {
        radialBar: {
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '65%'
          },
          track: {
            background: this.$white,
            strokeWidth: '100%'
          },
          dataLabels: {
            name: {
              offsetY: -5,
              color: this.$textHeadingColor,
              fontSize: '1rem'
            },
            value: {
              offsetY: 15,
              color: this.$textHeadingColor,
              fontSize: '1.714rem'
            }
          }
        }
      },
      colors: [colors.solid.danger],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [colors.solid.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        dashArray: 8
      },
      labels: ['Implémentée']
    };
  }
 downloadReport(filePath: string,fileName) {
    this.accueilService.downloadReport(filePath).subscribe((response: HttpResponse<Blob>) => {
      // Récupérez le contenu de la réponse (le fichier PDF) depuis le blob
      const blob = new Blob([response.body], { type: 'application/pdf' });

      // Créez un objet URL pour le blob afin de le télécharger
      const downloadUrl = window.URL.createObjectURL(blob);

      // Créez un élément <a> pour déclencher le téléchargement du fichier
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click(); // Déclenche le téléchargement
      document.body.removeChild(a); // Supprime l'élément <a> du DOM après le téléchargement
      window.URL.revokeObjectURL(downloadUrl); // Libère l'URL de l'objet blob
    }, error => {
      console.error('Error downloading the report:', error);
      // Gérez les erreurs de téléchargement ici
    });
  }
  calculerdelai(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.abs(Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24)));
}
createFullName(lastName:string,firstName:string){
  const fullNamePattern=lastName+'_'+firstName;
  return fullNamePattern;
}
//role helper !
  hasRoleManager(){
    if(this.currentUser.realProfil=="MANAGER")
      return true;
    return false
  }
  isInOffice(){
    if(this.currentUser.workStatus=="OFFICE")
          return true;
    return false
  }
  isInHolliday(){
    if(this.currentUser.workStatus=="HOLLIDAY")
         return true;
    return false
  }
    isInMission(){
    if(this.currentUser.workStatus=="MISSION")
         return true;
    return false
  }

   
  

  /**
   * After View Init
   */
  ngAfterViewInit() {
    
    // Subscribe to core config changes
    this._coreConfigService.getConfig().subscribe(config => {
      // If Menu Collapsed Changes
      if (config.layout.menu.collapsed === true || config.layout.menu.collapsed === false) {
        setTimeout(() => {
          // Get Dynamic Width for Charts
          this.isMenuToggled = false;
          this.gainedChartoptions.chart.width = this.gainedChartRef?.nativeElement.offsetWidth;
          this.orderChartoptions.chart.width = this.orderChartRef?.nativeElement.offsetWidth;
          this.avgsessionChartoptions.chart.width = this.avgSessionChartRef?.nativeElement.offsetWidth;
          this.supportChartoptions.chart.width = this.supportChartRef?.nativeElement.offsetWidth;
          this.salesChartoptions.chart.width = this.salesChartRef?.nativeElement.offsetWidth;
        }, 1000);
      }
    });
  }
}
