import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { CoreConfigService } from '@core/services/config.service';
import { CoreTranslationService } from '@core/services/translation.service';

import { User } from 'app/auth/models';
import { colors } from 'app/colors.const';
import { AuthenticationService } from 'app/auth/service';
import { DashboardService } from 'app/main/dashboard/dashboard.service';


import { Profil } from 'app/auth/models/profil';
import { EspaceEquipeService } from './espace-equipe.service';
import { Team } from '../model/team';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexPlotOptions, ApexStroke, ApexTheme, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { ChartOptions2 } from 'app/main/charts-and-maps/charts/apex/apex.component';
import { Project } from '../model/project';
import { HttpResponse } from '@angular/common/http';

// interface ChartOptions
export interface ChartOptions {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
  stroke?: ApexStroke;
  legend?: ApexLegend;
  title?: ApexTitleSubtitle;
  colors?: string[];
  tooltip?: ApexTooltip;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  fill?: ApexFill;
  labels?: string[];
  markers: ApexMarkers;
  theme: ApexTheme;
}
@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceComponent implements OnInit {
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
  @ViewChild('deleteBtn') deleteBtn: any;
  @ViewChild('apexBarChartRef') apexBarChartRef: any;
  @ViewChild('apexDonutChartRef') apexDonutChartRef: any;
  @ViewChild("btnPlus") btnPlus:any;
  @ViewChild("btnPlusManagers") btnPlusManagers:any;

  private filePathTeamReport="C:\\Users\\pc\\Desktop\\DXCsynergy\\reports\\teamsReport.pdf"
   public searchValue = '';
   public tempFilterData;
   public previousStatusFilter = '';
   public selectedStatus = [];
   public selectStatus: any = [
    { name: 'All', value: '' },
    { name: 'AVAILABLE', value: 'AVAILABLE' },
    { name: 'IN_PROJECT', value: 'IN_PROJECT' },
    { name: 'HOLLIDAY', value: 'HOLLIDAY' },
  ];

  public searchValueManagers = '';
   public tempFilterDataManagers;
   public previousStatusFilterManagers = '';
   public selectedStatusManagers = [];
   public selectStatusManagers: any = [
    { name: 'All', value: '' },
    { name: 'OFFICE', value: 'OFFICE' },
    { name: 'MISSION', value: 'MISSION' },
    { name: 'HOLLIDAY', value: 'HOLLIDAY' },
  ];

  //business data
   public equipes:Array<Team>;
   public nombreEquipes:number;
   public nombreCollaborateurs:number;

   public projets:Array<Project>=[];
   public nombreProjets:number;

   public projetsEncours:Array<Project>=[];
   public nombreProjetsEncours:number;

   public projetsAccomplis:Array<Project>=[];
   public nombreProjetsAccomplis:number;

   public teamsAvailable:Array<Team>=[];
   public numberTeamsAvailable:number=0;

   public teamsInProject:Array<Team>=[];
   public numberTeamsInProject:number=0;

   public teamsHolliday:Array<Team>=[];
   public numberTeamsHolliday:number=0;

   public deletedTeamAcronyme:string;
   public deletedTeamName:string;

   public searchedTeam:string='';
   public showCount: number = 6;

   public teamsAcronyme:Array<string>=[];
   public teamsCollaborateurs:Array<number>=[];

   public tauxSatisfaction:number=0;
   public nbrSentimentEntred:number=0;
   public pourcentageSentimentSaisis:number=0;

   public managers:Array<User>=[];
   public numberOfManagers:number=0;
   public numberOfManagerInHolliday=0;
   public numberOfManagerInOffice:number=0;
   public numberOfManagerInMission:number=0;

   public searchedManager:string='';
   public showCountManagers: number = 3;
  // Public
      public apexBarChart: Partial<ChartOptions>;

    public apexDonutChart: Partial<ChartOptions2>;

    public teamsRow:any;
    public managersRow:any;

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

  /**
   * Constructor
   * @param {AuthenticationService} _authenticationService
   * @param {DashboardService} _dashboardService
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreTranslationService} _coreTranslationService
   * @param {NgbModal} modalService

   */

  constructor(
    private modalService:NgbModal,
    private router:Router,
    private _authenticationService: AuthenticationService,
    private espaceEquipeService:EspaceEquipeService,
    private _dashboardService: DashboardService,
    private _coreConfigService: CoreConfigService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
    this.isManager = this._authenticationService.isManager;
    this.isCollaborator = this._authenticationService.isCollaborator;

    // this._coreTranslationService.translate(english, french, german, portuguese);
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
  

   filterRows(statusFilter): any[] {
    // Reset search on select change
    this.searchValue = '';

    statusFilter = statusFilter.toLowerCase();

    return this.teamsRow.filter(row => {
      const isPartialNameMatch = row.workTeamStatus.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
      return isPartialNameMatch;
    });
  }
  filterRowsManagers(statusFilter): any[] {
    // Reset search on select change
    this.searchValueManagers = '';

    statusFilter = statusFilter.toLowerCase();

    return this.managersRow.filter(row => {
      const isPartialNameMatch = row.workStatus.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
      return isPartialNameMatch;
    });
  }
 /**
   * filterUpdate
   *
   * @param event
   */


   filterByStatus(event) {
    const filter = event ? event.value : '';
    this.previousStatusFilter = filter;
    this.tempFilterData = this.filterRows(filter);
    this.equipes = this.tempFilterData;
    
  }
   filterByStatusManagers(event) {
    const filter = event ? event.value : '';
    this.previousStatusFilterManagers = filter;
    this.tempFilterDataManagers = this.filterRowsManagers(filter);
    this.managers = this.tempFilterDataManagers;
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // get the currentUser details from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    this.getAllTeamsOfDepartment();
    this.getNumberOfCollaboratorsOfDepartment();
    this.getAllProjectOfDepartment();
   
    // Get the dashboard service data
    this._dashboardService.onApiDataChanged.subscribe(response => {
      this.data = response;
    });
  }
  //chart initialization start
initializeWorkStatusChart(){
    this.apexDonutChart = {
      series: [this.numberTeamsAvailable,this.numberTeamsInProject,this.numberTeamsHolliday],
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
      labels: ['AVAILABLE', 'IN PROJECT', 'HOLLIDAY'],
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
initializeNbrCollaborateursParEquipeChart(){
    // Apex Bar Chart
    this.apexBarChart = {
      series: [
        {
          data: this.teamsCollaborateurs
        }
      ],
      chart: {
        height: 400,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal:false,
          barHeight: '20%',
        }
      },
      grid: {
        xaxis: {
          lines: {
            show: false
          }
        }
      },
      colors: [colors.solid.info],
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: this.teamsAcronyme
      }
    };
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
            this.apexBarChart.chart.width = this.apexBarChartRef?.nativeElement.offsetWidth;
             this.apexDonutChart.chart.width = this.apexDonutChartRef?.nativeElement.offsetWidth;

          }
        }, 500);
      }
    });
  }
  voirEquipe(acronyme:string,name:string){
 this.router.navigate(['dashboard/equipe'], { queryParams: { acronyme: acronyme,name:name } });
  }
  dirigerAddTeam(){
     this.router.navigate(['dashboard/addTeam']);
  }
  sortEquipesByAcronymeFirstLetter(equipes: any[]): any[] {
    return equipes.sort((a, b) => {
      const acronymeA = a.acronyme.toLowerCase();
      const acronymeB = b.acronyme.toLowerCase();
      if (acronymeA < acronymeB) {
        return -1;
      }
      if (acronymeA > acronymeB) {
        return 1;
      }
      return 0;
    });
  }
   sortManagersByNameFirstLetter(managers: any[]): any[] {
    return managers.sort((a, b) => {
      const lastNameA = a.lastName.toLowerCase();
      const lastNameB = b.lastName.toLowerCase();
      if (lastNameA < lastNameB) {
        return -1;
      }
      if (lastNameA > lastNameB) {
        return 1;
      }
      return 0;
    });
  }
  getAllSentimentsOfDepartment(){
     this.espaceEquipeService.getSentimentEntredTodayOfDepartment(this.currentUser.departmentAcronyme).subscribe(
    {
      next:(sentiments)=>{
        console.log("sentimens saisies")
        console.log(sentiments);
        this.nbrSentimentEntred=sentiments.length
        const satisfiedMembers=sentiments.filter(sentiment=>sentiment.feelingStatus=="SATISFIED")
        console.log("satisfied memeber are :")
        console.log(satisfiedMembers)
        this.tauxSatisfaction=(satisfiedMembers.length/this.nbrSentimentEntred)*100
        console.log("taux de satisfaction = "+this.tauxSatisfaction)
        console.log("nbr de sentiment saisie est "+this.nbrSentimentEntred);

        this.pourcentageSentimentSaisis=(this.nbrSentimentEntred/this.nombreCollaborateurs)*100;
      }
    }
  )
  }
  getAllTeamsOfDepartment(){
     this.espaceEquipeService.getAllTeamsOfDepartment(this.currentUser.departmentAcronyme).subscribe(
      {
         next: (equipes) => {
        this.equipes=equipes;
        this.teamsRow=equipes;
        this.nombreEquipes=equipes.length
        console.log(equipes)

        for(const equipe of equipes){
          this.teamsAcronyme.push(equipe.name);
          this.teamsCollaborateurs.push(equipe.nbrCollaborteurs);

          this.teamsAvailable=this.equipes.filter(equipe=>equipe.workTeamStatus=="AVAILABLE");
          this.numberTeamsAvailable=this.teamsAvailable.length;

          this.teamsInProject=this.equipes.filter(equipe=>equipe.workTeamStatus=="IN_PROJECT");
          this.numberTeamsInProject=this.teamsInProject.length;

          this.teamsHolliday=this.equipes.filter(equipe=>equipe.workTeamStatus=="HOLLIDAY");
          this.numberTeamsHolliday=this.teamsHolliday.length;
        }

        this.initializeNbrCollaborateursParEquipeChart()
        this.initializeWorkStatusChart()
        this.getAllSentimentsOfDepartment();
      },
      error: (error) => {
        console.log('Error searching users:', error);
      }
      }
     )
  }
  getAllProjectOfDepartment(){
 this.espaceEquipeService.getAllProjectsOfdepartment(this.currentUser.departmentAcronyme).subscribe(
      {
         next: (projets) => {
          console.log("all projects to debug")
          console.log(projets);
        this.projets=projets;
        this.nombreProjets=projets.length;

        this.projetsEncours=this.projets.filter(projet=>projet.projectStatus=="IN_PROGRESS")
        console.log("projet en cours to debug !")
        console.log(this.projetsEncours)
        this.nombreProjetsEncours=this.projetsEncours.length;
        this.calculateProgressionOfAllCurrentProjects();

        this.projetsAccomplis=this.projets.filter(projet=>projet.projectStatus=="FINISHED")
        this.nombreProjetsAccomplis=this.projetsAccomplis.length;
        this.getAllManagersOfdepartment();
      },
      error: (error) => {
        console.log('Error searching users:', error);
      }
      }
     )
  }
  getNumberOfProjectInProgressOfManagers(){
    console.log("projets en cours in managers method")
    console.log(this.projetsEncours)
    for(var manager of this.managers){
       const projectMonitoredByManagerNow=this.projetsEncours.filter(projet=>projet.managerEmail==manager.email);
       manager.nbrProjectInprogressMonitored=projectMonitoredByManagerNow.length;
       console.log("projects monitored by "+manager.email)
       console.log(projectMonitoredByManagerNow);
    }
  }
  getAllManagersOfdepartment(){
    const departmentAcronymInput=this.currentUser.departmentAcronyme.toUpperCase();
    this.espaceEquipeService.getAllManagersOfDepartment(departmentAcronymInput).subscribe(
      {
        next: (managers)=>{
          console.log("managers of department ")
          console.log(managers);
          this.managers=managers;
          //just for fileting
          this.managersRow=managers;
          
          this.numberOfManagers=this.managers.length;
          this.numberOfManagerInOffice=(this.managers.filter(manager=>manager.workStatus=="OFFICE")).length;          
          this.numberOfManagerInHolliday=(this.managers.filter(manager=>manager.workStatus=="HOLLIDAY")).length;
          this.numberOfManagerInMission=(this.managers.filter(manager=>manager.workStatus=="MISSION")).length;

          console.log("managers office : "+this.numberOfManagerInOffice)
          console.log("managers holliday : "+this.numberOfManagerInHolliday)
          console.log("managers mission : "+this.numberOfManagerInMission)
          
          this.getNumberOfProjectInProgressOfManagers();

        }
      }
    )
  }
  deleteTeam(){
    this.espaceEquipeService.deleteTeam(this.deletedTeamAcronyme).subscribe(
      {
         next: (response) => {
        this.refreshPage();
      },
      error: (error) => {
        console.log('Error searching users:', error);
      }
      }
     )
  }
   generateTeamsReport(): void {
    const format = 'pdf'; 
    this.espaceEquipeService.generateTeamsReport(format).subscribe((response: any) => {
      this.downloadReport(this.filePathTeamReport,"teamsReport");
    });
  }
   downloadReport(filePath: string,fileName) {
    this.espaceEquipeService.downloadReport(filePath).subscribe((response: HttpResponse<Blob>) => {
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
  getNumberOfCollaboratorsOfDepartment(){
    this.espaceEquipeService.calculateNumberOfCollabortorsOfDepartmnt(this.currentUser.departmentAcronyme).subscribe(
      {
        next:(number)=>{
          this.nombreCollaborateurs=parseInt(number);
          console.log(number+" collaborateurs")
        }
      }
    )
  }
   calculateProgressionOfProject(project:Project){
    var functionalitiesStored:any=[];
    var progression:number=0;
     this.espaceEquipeService.getAllFunctionalityOfProject(project.backlogTitle).subscribe({
          next:(functionalities)=>{
             functionalitiesStored= functionalities;
             console.log("fonctionnalité ici")
             console.log(functionalities)
             var totalFunctionality=functionalitiesStored.length;
             var FunctionalityFinished=functionalitiesStored.filter(func=>func.state=="FINISHED")
             var numberFunctionalityFinished=FunctionalityFinished.length;
             progression=(numberFunctionalityFinished/totalFunctionality)*100 || 0;
             project.progression=progression;
             console.log("calculated progression"+progression);
             console.log("progression of project "+project.title+ "est "+project.progression );
             
          }  
        } 
        )
        return progression;
   }
   async calculateProgressionOfAllCurrentProjects(){
     
     for(const project of this.projetsEncours){
      console.log("backlog of project 1")
      console.log(project.backlogTitle)
        this.calculateProgressionOfProject(project);
       
     }
   }

   
   //Roles helpers start
   hasRoleManager(){
    if(this.currentUser.realProfil=="MANAGER")
      return true;
    return false;
   }
    hasRoleTechLead(){
    if(this.currentUser.realProfil=="TECH_LEAD")
      return true;
    return false;
   }
     hasRoleScrumMaster(){
    if(this.currentUser.realProfil=="SCRUM_MASTER")
      return true;
    return false;
   }
    hasRoleCollaborator(){
    if(this.currentUser.realProfil=="COLLABORATOR")
      return true;
    return false;
   }
 //Roles helpers end

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
   calculerDelai(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.abs(Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24)));
}
calculerRetard(estimated: string, actual: string): number {
    // Créer des objets Date à partir des chaînes de dates
    const estimatedDate = new Date(estimated);
    const actualDate = new Date(actual);

    // Vérifier si les dates sont valides
    if (isNaN(estimatedDate.getTime()) || isNaN(actualDate.getTime())) {
        console.error('Les dates fournies ne sont pas valides.');
        return 0; // Retourner une valeur par défaut ou une indication d'erreur
    }

    // Calculer la différence en millisecondes
    const differenceMs = actualDate.getTime() - estimatedDate.getTime();

    // Convertir la différence de millisecondes en jours
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return Math.abs(differenceDays);
}


calculateAge(dateOfBirth: Date): number {
    const birthday = new Date(dateOfBirth);
    const ageDiffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiffMs); // Epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  // formating helpers
formatDate(date:Date):string{
       const formattedDate:string=this.pipe.transform(date, 'dd/MM/yyyy');
       return formattedDate;
}
getDay(date: any): string {
  return new Date(date).getDate().toString();
}

getMonth(date: any): string {
  const monthIndex = new Date(date).getMonth(); // Récupère l'index du mois (0-11)
  const monthShortName = new Date(date).toLocaleString('default', { month: 'short' }); // Récupère les trois premières lettres du nom du mois
  return monthShortName;
}
 refreshPage(){
    window.location.reload();
 }
  // modal Open Danger
  modalOpenDanger(modalDanger,acronyme,name) {
    this.deletedTeamAcronyme=acronyme;
    this.deletedTeamName=name;
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: 'modal modal-danger'
    });
  }
afficherPlus(){
  if(this.searchedTeam==''){
    this.showCount=6;
  }
  else{
     this.btnPlus.nativeElement.click();
  }
}
afficherPlusManagers(){
  if(this.searchedManager==''){
    this.showCountManagers=3;
  }
  else{
     this.btnPlusManagers.nativeElement.click();
  }
}
}
