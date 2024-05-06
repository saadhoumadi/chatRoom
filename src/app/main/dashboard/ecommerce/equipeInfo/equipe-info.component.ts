import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { EspaceEquipeService } from '../espace-equipe.service';
import { DashboardService } from '../../dashboard.service';
import { CoreConfigService } from '@core/services/config.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { colors } from 'app/colors.const';
import { Team } from '../../model/team';
import { User } from 'app/auth/models';
import { DatePipe } from '@angular/common';
import { Profil } from 'app/auth/models/profil';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ChartOptions2 } from 'app/main/charts-and-maps/charts/apex/apex.component';
import { filter } from 'rxjs/operators';
import { ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexMarkers, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStates, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { Project } from '../../model/project';
import { Task } from '../../model/task';
import { Functionality } from '../../model/Functionality';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


export interface ChartOptions {
  // Apex-Non-Axis-Chart-Series
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  colors: string[];
  legend: ApexLegend;
  labels: any;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  markers: ApexMarkers[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  states: ApexStates;
}
@Component({
  selector: 'app-equipe-info',
  templateUrl: './equipe-info.component.html',
  styleUrls: ['./equipe-info.component.scss']
})
export class EquipeInfoComponent implements OnInit {

   // Decorator
  @ViewChild('statisticsBarChartRef') statisticsBarChartRef: any;
  @ViewChild('statisticsLineChartRef') statisticsLineChartRef: any;
  @ViewChild('earningChartRef') earningChartRef: any;
  @ViewChild('revenueReportChartRef') revenueReportChartRef: any;
  @ViewChild('budgetChartRef') budgetChartRef: any;
  @ViewChild('statePrimaryChartRef') statePrimaryChartRef: any;
  @ViewChild('stateWarningChartRef') stateWarningChartRef: any;
  @ViewChild('stateSecondaryChartRef') stateSecondaryChartRef: any;
  @ViewChild('stateInfoChartRef') stateInfoChartRef: any;
  @ViewChild('stateDangerChartRef') stateDangerChartRef: any;
  @ViewChild('goalChartRef') goalChartRef: any;
  @ViewChild('apexDonutChartRef') apexDonutChartRef: any;
  @ViewChild('customerChartoptionsRef') customerChartoptionsRef: any;
  @ViewChild('supportChartRef') supportChartRef: any;






  //to avoid nan errors start
  public hasTechLead:boolean=false
  public hasMembers:boolean=false;
  //to avoid nan errors end
  //business data
  public acronyme:string;
  public teamName:string;
  public collaborateurs:Array<User>=[];
  public top5collaborateurs:Array<User>=[];
  public techLead:User;
  public nombreCollaborateurs:number;
  public searchedTeam:string='';
  public showCount: number = 6;

  public collaborateursInOffice:Array<User>=[];
  public collaborateursInHolliday:Array<User>=[];
  public collaborateursInMission:Array<User>=[];

  public collaborateursLess5xp:Array<User>=[];
  public collaborateursBetween510xp:Array<User>=[];
  public collaborateursMore10xp:Array<User>=[];

  public numberCollaborateursLess5xp:number=0;
  public numberCollaborateursBetween510xp:number=0;
  public numberCollaborateursMore10xp:number=0;

  public numberOfcollaborateursInOffice:number=0;
  public numberOfcollaborateursInMission:number=0;
  public numberOfcollaborateursInHolliday:number=0;

    public numberSentimentsEntred:number=0;
    public pourcentageSentimentSaisis:number=0;
    public tauxSatisfaction:number=0;


  public projets:Array<Project>=[];
  public projetEncours:Project;
  public projetsFinis:Array<Project>=[];

  public tasksOfCurrentProject:Array<Task>;
  public numberTasksFinished:number=0;
  public totalTasks:number=0;

  //projet en cours stats
   public functionalitiesOfEndSoonProject:Array<Functionality>=[];
   public totalFunctionalityOfProjectEndSoon:number=0;
   public numberFinishedFunctionalityOfProjectEndSoon:number=0;
   public numberTODOFunctionalityOfProjectEndSoon:number=0;
   public functionalityNotImplementedInProjectEndSoonTop5:number=0;

  public supportChartoptions;
  public functionnalitySupportData:any;
  public selectStatus: any = [
    { name: 'All', value: '' },
    { name: 'AVAILABLE', value: 'AVAILABLE' },
    { name: 'IN_PROJECT', value: 'IN_PROJECT' },
    { name: 'HOLLIDAY', value: 'HOLLIDAY' },
   
  ];


  // Public
    public apexDonutChart: Partial<ChartOptions2>;
      public customerChartoptions: Partial<ChartOptions>;


  public data: any;
  public currentUser: User;
  public isManager: boolean;
  public isCollaborator: boolean;
  public statisticsBar;
  public statisticsLine;
  public revenueReportChartoptions;
  public budgetChartoptions;
  public goalChartoptions;
  public statePrimaryChartoptions;
  public stateWarningChartoptions;
  public stateSecondaryChartoptions;
  public stateInfoChartoptions;
  public stateDangerChartoptions;
  public earningChartoptions;
  public isMenuToggled = false;
  public pipe = new DatePipe('en-US');

  // Private
  
  private $barColor = '#f3f3f3';
  private $trackBgColor = '#EBEBEB';
  private $textMutedColor = '#b9b9c3';
  private $budgetStrokeColor2 = '#dcdae3';
  private $goalStrokeColor2 = '#51e5a8';
  private $textHeadingColor = '#5e5873';
  private $strokeColor = '#ebe9f1';
  private $earningsStrokeColor2 = '#28c76f66';
  private $earningsStrokeColor3 = '#28c76f33';
  // Private
  
  private $white = '#fff';
 

   // Color Variables
  chartColors = {
    column: {
      series1: '#826af9',
      series2: '#d2b0ff',
      bg: '#f8d3ff'
    },
    success: {
      shade_100: '#7eefc7',
      shade_200: '#06774f'
    },
    donut: {
      series1: '#28c76f',
      series2: '#ffa550',
      series3: '#ea5455',
      series4: '#2b9bf4',
      series5: '#FFA1A1'
    },
    area: {
      series3: '#a4f8cd',
      series2: '#60f2ca',
      series1: '#2bdac7'
    }
  };

  /**
   * Constructor
   * @param {AuthenticationService} _authenticationService
   * @param {DashboardService} _dashboardService
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreTranslationService} _coreTranslationService
   *   @param {NgbModal} modalService

   */
  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private _authenticationService: AuthenticationService,
    private espaceEquipeService:EspaceEquipeService,
    private _dashboardService: DashboardService,
    private _coreConfigService: CoreConfigService,
    private _coreTranslationService: CoreTranslationService,
    private modalService: NgbModal
  ) {
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
    this.isManager = this._authenticationService.isManager;
    this.isCollaborator = this._authenticationService.isCollaborator;

  // Apex Radial Chart
   
    // Statistics Bar Chart
    this.statisticsBar = {
      chart: {
        height: 70,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false
        }
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
          top: -15,
          bottom: -15
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '20%',
          startingShape: 'rounded',
          colors: {
            backgroundBarColors: [this.$barColor, this.$barColor, this.$barColor, this.$barColor, this.$barColor],
            backgroundBarRadius: 5
          }
        }
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      colors: [colors.solid.warning],
      series: [
        {
          name: '2020',
          data: [45, 85, 65, 45, 65]
        }
      ],
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      tooltip: {
        x: {
          show: false
        }
      }
    };

    // Statistics Line Chart
    this.statisticsLine = {
      chart: {
        height: 70,
        type: 'line',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      grid: {
        // show: true,
        borderColor: this.$trackBgColor,
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
        padding: {
          // left: 0,
          // right: 0,
          top: -30,
          bottom: -10
        }
      },
      stroke: {
        width: 3
      },
      colors: [colors.solid.info],
      series: [
        {
          data: [0, 20, 5, 30, 15, 45]
        }
      ],
      markers: {
        size: 2,
        colors: colors.solid.info,
        strokeColors: colors.solid.info,
        strokeWidth: 2,
        strokeOpacity: 1,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 5,
            fillColor: '#ffffff',
            strokeColor: colors.solid.info,
            size: 5
          }
        ],
        shape: 'circle',
        radius: 2,
        hover: {
          size: 3
        }
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontSize: '0px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      tooltip: {
        x: {
          show: false
        }
      }
    };

    // Revenue Report Chart
    this.revenueReportChartoptions = {
      chart: {
        height: 230,
        stacked: true,
        type: 'bar',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          columnWidth: '17%',
          endingShape: 'rounded'
        }
      },
      colors: [colors.solid.primary, colors.solid.warning],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        padding: {
          top: -20,
          bottom: -10
        },
        yaxis: {
          lines: { show: false }
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        labels: {
          style: {
            colors: this.$textMutedColor,
            fontSize: '0.86rem'
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: this.$textMutedColor,
            fontSize: '0.86rem'
          }
        }
      }
    };

    // Budget Chart
    this.budgetChartoptions = {
      chart: {
        height: 80,
        toolbar: { show: false },
        zoom: { enabled: false },
        type: 'line',
        sparkline: { enabled: true }
      },
      stroke: {
        curve: 'smooth',
        dashArray: [0, 5],
        width: [2]
      },
      colors: [colors.solid.primary, this.$budgetStrokeColor2],
      tooltip: {
        enabled: false
      }
    };

    // Goal Overview  Chart
    this.goalChartoptions = {
      chart: {
        height: 245,
        type: 'radialBar',
        sparkline: {
          enabled: true
        },
        dropShadow: {
          enabled: true,
          blur: 3,
          left: 1,
          top: 1,
          opacity: 0.1
        }
      },
      colors: [this.$goalStrokeColor2],
      plotOptions: {
        radialBar: {
          offsetY: -10,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '77%'
          },
          track: {
            background: this.$strokeColor,
            strokeWidth: '50%'
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              color: this.$textHeadingColor,
              fontSize: '2.86rem',
              fontWeight: '600'
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [colors.solid.success],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: 'round'
      },
      grid: {
        padding: {
          bottom: 30
        }
      }
    };

    // Browser States Primary Chart
    this.statePrimaryChartoptions = {
      chart: {
        height: 30,
        width: 30,
        type: 'radialBar'
      },
      grid: {
        show: false,
        padding: {
          left: -15,
          right: -15,
          top: -12,
          bottom: -15
        }
      },
      colors: [colors.solid.primary],
      series: [54.4],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '22%'
          },
          track: {
            background: this.$trackBgColor
          },
          dataLabels: {
            showOn: 'always',
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      stroke: {
        lineCap: 'round'
      }
    };

    // Browser States Warning Chart
    this.stateWarningChartoptions = {
      chart: {
        height: 30,
        width: 30,
        type: 'radialBar'
      },
      grid: {
        show: false,
        padding: {
          left: -15,
          right: -15,
          top: -12,
          bottom: -15
        }
      },
      colors: [colors.solid.warning],
      series: [6.1],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '22%'
          },
          track: {
            background: this.$trackBgColor
          },
          dataLabels: {
            showOn: 'always',
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      stroke: {
        lineCap: 'round'
      }
    };

    // Browser States Secondary Chart
    this.stateSecondaryChartoptions = {
      chart: {
        height: 30,
        width: 30,
        type: 'radialBar'
      },
      grid: {
        show: false,
        padding: {
          left: -15,
          right: -15,
          top: -12,
          bottom: -15
        }
      },
      colors: [colors.solid.secondary],
      series: [14.6],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '22%'
          },
          track: {
            background: this.$trackBgColor
          },
          dataLabels: {
            showOn: 'always',
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      stroke: {
        lineCap: 'round'
      }
    };

    // Browser States Info Chart
    this.stateInfoChartoptions = {
      chart: {
        height: 30,
        width: 30,
        type: 'radialBar'
      },
      grid: {
        show: false,
        padding: {
          left: -15,
          right: -15,
          top: -12,
          bottom: -15
        }
      },
      colors: [colors.solid.info],
      series: [4.2],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '22%'
          },
          track: {
            background: this.$trackBgColor
          },
          dataLabels: {
            showOn: 'always',
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      stroke: {
        lineCap: 'round'
      }
    };

    // Browser States Danger Chart
    this.stateDangerChartoptions = {
      chart: {
        height: 30,
        width: 30,
        type: 'radialBar'
      },
      grid: {
        show: false,
        padding: {
          left: -15,
          right: -15,
          top: -12,
          bottom: -15
        }
      },
      colors: [colors.solid.danger],
      series: [8.4],
      plotOptions: {
        radialBar: {
          hollow: {
            size: '22%'
          },
          track: {
            background: this.$trackBgColor
          },
          dataLabels: {
            showOn: 'always',
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      stroke: {
        lineCap: 'round'
      }
    };

    // Earnings Chart
    this.earningChartoptions = {
      chart: {
        type: 'donut',
        height: 120,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [53, 16, 31],
      legend: { show: false },
      comparedResult: [2, -3, 8],
      labels: ['App', 'Service', 'Product'],
      stroke: { width: 0 },
      colors: [this.$earningsStrokeColor2, this.$earningsStrokeColor3, colors.solid.success],
      grid: {
        padding: {
          right: -20,
          bottom: -8,
          left: -20
        }
      },
      plotOptions: {
        pie: {
          startAngle: -10,
          donut: {
            labels: {
              show: true,
              name: {
                offsetY: 15
              },
              value: {
                offsetY: -15,
                formatter: function (val) {
                  return parseInt(val) + '%';
                }
              },
              total: {
                show: true,
                offsetY: 15,
                label: 'App',
                formatter: function (w) {
                  return '53%';
                }
              }
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 1325,
          options: {
            chart: {
              height: 100
            }
          }
        },
        {
          breakpoint: 1200,
          options: {
            chart: {
              height: 120
            }
          }
        },
        {
          breakpoint: 1065,
          options: {
            chart: {
              height: 100
            }
          }
        },
        {
          breakpoint: 992,
          options: {
            chart: {
              height: 120
            }
          }
        }
      ]
    };
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    
    // get the currentUser details from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.activatedRoute.queryParams.subscribe(params => {
    //vue manager
    if (this.hasRoleManager()) {
        this.acronyme = params.acronyme;
        this.teamName=params.name;
        console.log('Acronyme de l\'équipe : ', this.acronyme);
      }
      //vue collaborator
      else{
        this.acronyme=this.currentUser.teamAcronyme
      }

      //executé quelque soit
        this.getAllUsersOfTeam();
       this.getTechLeadOfTeam();
      this.getTop5usersOfTeam();
      this.getAllProjectsOfTeam();
      this.getcurrentProjectDetails();
      this.getNumberOfsentimentsEntredOfTeam()
  });

    // Get the dashboard service data
    this._dashboardService.onApiDataChanged.subscribe(response => {
      this.data = response;
    });

    
  }
 hasRoleManager(){
  if(this.currentUser.realProfil=='MANAGER')
    return true;
  return false;
 }
  /**
   * After View Init
   */
  ngAfterViewInit() {

    // Subscribe to core config changes
    this._coreConfigService.getConfig().subscribe(config => {
      // If Menu Collapsed Changes
      if (
        (config.layout.menu.collapsed === true || config.layout.menu.collapsed === false) &&
        localStorage.getItem('currentUser')
      ) {
        setTimeout(() => {
          if (this.currentUser.realProfil == Profil.MANAGER) {
            // Get Dynamic Width for Charts
            this.isMenuToggled = true;
            this.statisticsBar.chart.width = this.statisticsBarChartRef?.nativeElement.offsetWidth;
            this.statisticsLine.chart.width = this.statisticsLineChartRef?.nativeElement.offsetWidth;
            this.earningChartoptions.chart.width = this.earningChartRef?.nativeElement.offsetWidth;
            this.revenueReportChartoptions.chart.width = this.revenueReportChartRef?.nativeElement.offsetWidth;
            this.budgetChartoptions.chart.width = this.budgetChartRef?.nativeElement.offsetWidth;
            this.goalChartoptions.chart.width = this.goalChartRef?.nativeElement.offsetWidth;
             this.apexDonutChart.chart.width = this.apexDonutChartRef?.nativeElement.offsetWidth;
             this.customerChartoptions.chart.width = this.customerChartoptionsRef?.nativeElement.offsetWidth;
            this.supportChartoptions.chart.width = this.supportChartRef?.nativeElement.offsetWidth;



          }
        }, 500);
      }
    });
  }

filterCollaborateusByStatus(){
  this.collaborateursInOffice=this.collaborateurs.filter(collaborateur=>collaborateur.workStatus==="OFFICE");
  this.numberOfcollaborateursInOffice=this.collaborateursInOffice.length;
 

  this.collaborateursInMission=this.collaborateurs.filter(collaborateur=>collaborateur.workStatus==="MISSION");
  this.numberOfcollaborateursInMission=this.collaborateursInMission.length;

  this.collaborateursInHolliday=this.collaborateurs.filter(collaborateur=>collaborateur.workStatus==="HOLLIDAY")
  this.numberOfcollaborateursInHolliday=this.collaborateursInHolliday.length;
    this.initializeWorkStatusChart();
  }
filterByExperience(){
 this.collaborateursLess5xp=this.collaborateurs.filter(user=>this.calculateAge(user.dateEmbauche)<=5);
 this.numberCollaborateursLess5xp=this.collaborateursLess5xp.length;

 this.collaborateursBetween510xp=this.collaborateurs.filter(user=>(this.calculateAge(user.dateEmbauche)>5 && this.calculateAge(user.dateEmbauche)<=10));
 this.numberCollaborateursBetween510xp=this.collaborateursBetween510xp.length;
 
 this.collaborateursMore10xp=this.collaborateurs.filter(user=>this.calculateAge(user.dateEmbauche)>10);
 this.numberCollaborateursMore10xp=this.collaborateursMore10xp.length;

 this.initializeExperienceChart();
     

}
//chart initialization start
initializeWorkStatusChart(){
    this.apexDonutChart = {
      series: [this.numberOfcollaborateursInOffice, this.numberOfcollaborateursInHolliday,this.numberOfcollaborateursInMission ],
      chart: {
        height: 350,
        type: 'donut'
      },
      colors: [
        this.chartColors.donut.series1,
        this.chartColors.donut.series2,
        this.chartColors.donut.series3,
      ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '2rem',
                fontFamily: 'Montserrat'
              },
              value: {
                fontSize: '1rem',
                fontFamily: 'Montserrat',
                formatter: function (val) {
                  return (val) + ' membres';
                }
              },
             
            }
          }
        }
      },
      legend: {
        show: true,
        position: 'bottom'
      },
      labels: ['OFFICE', 'HOLLIDAY', 'MISSION'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
}
initializeExperienceChart(){
  this.customerChartoptions = {
      chart: {
        type: 'pie',
        height: 345,
        toolbar: {
          show: false
        }
      },
      labels: ['Moins 5 ans', 'Entre 5 et 10 ans', 'Plus de 10 ans'],
      dataLabels: {
        enabled: false
      },
      legend: { show: false },
      stroke: {
        width: 4
      },
      colors: [colors.solid.primary, colors.solid.warning, colors.solid.danger]
    };
   
}
//chart initialization end

getAllUsersOfTeam(){
   this.espaceEquipeService.getAllUsersOfTeam(this.acronyme).subscribe(
      {
         next: (users) => {
          console.log(users)
        this.collaborateurs=users;
        this.nombreCollaborateurs=users.length
        console.log(users)
        this.filterCollaborateusByStatus()
        this.filterByExperience();
        console.log(this.numberOfcollaborateursInOffice)

        this.updateHastTechLead(this.collaborateurs);
        this.updateHasMembers(this.collaborateurs);

      },
      error: (error) => {
        console.log('Error searching users:', error);
      }
      }
     )
}
updateHastTechLead(users:Array<User>){
  for(const user of users){
    if(user.realProfil=="TECH_LEAD")
      this.hasTechLead=true;
  }
}
updateHasMembers(users:Array<User>){
  if(users.length > 0)
    this.hasMembers=true;
  
}
 getTop5usersOfTeam(): void {
     this.espaceEquipeService.getAllUsersOfTeam(this.acronyme).subscribe({
      next: (users) => {
        console.log("top 5 users");
        // Tri des utilisateurs par âge en ordre décroissant
        users.sort((a, b) => {
          const ageA = this.calculateAge(a.dateEmbauche);
          const ageB = this.calculateAge(b.dateEmbauche);
          return ageB - ageA;
        });
        // Sélection des cinq premiers utilisateurs
        this.top5collaborateurs = users.slice(0,5);
        console.log(this.top5collaborateurs)
      },
      error: (error) => {
        console.log('Error searching users:', error);
      }
    });
  }
 
getTechLeadOfTeam(){
   this.espaceEquipeService.getTechLeadOfTeam(this.acronyme).subscribe(
      {
         next: (techLeadData) => {
          console.log("tech lead")
          console.log(techLeadData)
          this.techLead=techLeadData
      },
      error: (error) => {
        console.log('Error searching Tech lead:', error);
      }
      }
     )
}
getAllProjectsOfTeam(){
   this.espaceEquipeService.getAllProjectsOfTeam(this.acronyme).subscribe(
      {
         next: (projects) => {
          console.log("projects of team")
          console.log(projects)

          this.projets=projects;
          this.projetsFinis=this.projets.filter(projet=>projet.projectStatus=="FINISHED")
          this.projetsFinis.sort((a, b) => new Date(b.debutDate).getTime() - new Date(a.debutDate).getTime());
          this.projetsFinis=this.projetsFinis.slice(0,5);

       
          this.projetEncours=this.projets.filter(projet=>projet.projectStatus=="IN_PROGRESS")[0];
          console.log("projet en cours");
          console.log(this.projetEncours)

          this.getAllFunctionalityOfProjectEndSoon();
       
      },
      error: (error) => {
        console.log('Error searching users:', error);
      }
      }
     )
}getcurrentProjectDetails(){
  this.espaceEquipeService.getCurrentProjectDetailsOfTeam(this.acronyme).subscribe(
      {
         next: (currentProject) => {
          console.log("task of current project")
          console.log(currentProject)
          this.tasksOfCurrentProject=currentProject.currentSprintTasks;
          this.numberTasksFinished=this.tasksOfCurrentProject.filter(task=>task.taskStatus=="FINISHED").length;
          this.totalTasks=this.tasksOfCurrentProject.length;
          
      },
      error: (error) => {
        console.log('Error searching users:', error);
      }
      }
     )
}
getNumberOfsentimentsEntredOfTeam(){
  this.espaceEquipeService.getSentimentEntredTodayOfTeam(this.acronyme).subscribe(
    {
      next:(sentiments)=>{
        console.log("sentimens saisies")
        console.log(sentiments);
        this.numberSentimentsEntred=sentiments.length
        const satisfiedMembers=sentiments.filter(sentiment=>sentiment.feelingStatus=="SATISFIED")
        console.log("satisfied memeber are :")
        console.log(satisfiedMembers)
        this.tauxSatisfaction=(satisfiedMembers.length/this.numberSentimentsEntred)*100
        console.log("taux de satisfaction = "+this.tauxSatisfaction)
        console.log("nbr de sentiment saisie est "+this.numberSentimentsEntred);

        this.pourcentageSentimentSaisis=((this.numberSentimentsEntred/this.nombreCollaborateurs)*100);
      }
    }
  )
}
 getAllFunctionalityOfProjectEndSoon(){
     this.espaceEquipeService.getAllFunctionalityOfProject(this.projetEncours.backlogTitle).subscribe(
        {
          next:(functionalities)=>{
              console.log("projet encours backlog title"+ this.projetEncours.backlogTitle);
              console.log("all functionalities of project en cours deeeeeeeeebug");
              console.log(functionalities);
              this.functionalitiesOfEndSoonProject=functionalities;
              this.totalFunctionalityOfProjectEndSoon=this.functionalitiesOfEndSoonProject.length;
              this.numberFinishedFunctionalityOfProjectEndSoon=this.functionalitiesOfEndSoonProject.filter(functionality=>functionality.state=="FINISHED").length;
              this.numberTODOFunctionalityOfProjectEndSoon=this.functionalitiesOfEndSoonProject.filter(functionality=>functionality.state=="TO_DO").length;
              
   
  console.log("functionnality not implemented are order by priority ")
  console.log(this.functionalityNotImplementedInProjectEndSoonTop5);
              
              const avgFinishedFunctionality=((this.numberFinishedFunctionalityOfProjectEndSoon/this.totalFunctionalityOfProjectEndSoon)*100).toFixed(0)
             
              this.functionnalitySupportData={
      series: [avgFinishedFunctionality]
    
               }

          }
        }
      )
      this.initializeFunctionalityGraph()
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
      labels: ['Implémented']
    };
  }
   getDayOfWeek(selectedDate: string) {
    const dateObj = new Date(selectedDate);
    // Utiliser directement l'option weekday dans toLocaleDateString
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    return dayOfWeek;
  }
  getMonthNameFromDate(date: Date): string {
  const monthIndex = date.getMonth(); // Obtient l'index du mois (0 pour janvier, 1 pour février, etc.)
  const monthNames = [
    'JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'
  ];
  return monthNames[monthIndex]; // Retourne le nom du mois abrégé
}
  // formating helpers
formatDate(date:Date):string{
       const formattedDate:string=this.pipe.transform(date, 'dd/MM/yyyy');
       return formattedDate;
}
  calculerDelai(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.abs(Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24)));
}
getDay(date: any): string {
  return new Date(date).getDate().toString();
}
calculateAge(dateOfBirth: Date): number {
    const birthday = new Date(dateOfBirth);
    const ageDiffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiffMs); // Epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
getMonth(date: any): string {
  const monthIndex = new Date(date).getMonth(); // Récupère l'index du mois (0-11)
  const monthShortName = new Date(date).toLocaleString('default', { month: 'short' }); // Récupère les trois premières lettres du nom du mois
  return monthShortName;
}
 // create avatar YK like microsoft teams
    generateInitials(firstName: string, lastName: string): string {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}
createFullName(lastName:string,firstName:string){
  const fullNamePattern=lastName+'_'+firstName;
  return fullNamePattern;
}

 

}
