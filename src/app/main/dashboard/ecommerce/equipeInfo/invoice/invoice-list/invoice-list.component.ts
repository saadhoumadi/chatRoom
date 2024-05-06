import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation, Input } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { CoreConfigService } from '@core/services/config.service';
import { InvoiceListService } from './invoice-list.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';


@Component({
  selector: 'app-users-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceListComponent implements OnInit, OnDestroy {
    @Input() acronyme: string; 
    @Input() name:string;
    @ViewChild('btnModal') btnModal:any;


  // public
  public currentUser:User;
  public data: any;
  public selectedOption = 5;
  public ColumnMode = ColumnMode;
  public selectStatus: any = [
    { name: 'All', value: '' },
    { name: 'HOLLIDAY', value: 'HOLLIDAY' },
    { name: 'OFFICE', value: 'OFFICE' },
    { name: 'MISSION', value: 'MISSION' },
   
  ];
  public selectProfils: any = [
    { name: 'All', value: '' },
    { name: 'MANAGER', value: 'MANAGER' },
    { name: 'TECH_LEAD', value: 'TECH_LEAD' },
    { name: 'COLLABORATOR', value: 'COLLABORATOR' },
   
  ];

  public selectedStatus = [];
  public searchValue = '';

  // decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;
  public rows;
  public tempFilterData;
  public previousStatusFilter = '';
  public previousProfilFilter = '';

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {CalendarService} _calendarService
   * @param {InvoiceListService} _invoiceListService
   * @param {NgbModal} modalService
   */
  constructor(private modalService: NgbModal,private _invoiceListService: InvoiceListService, private _coreConfigService: CoreConfigService,private router:Router) {
    this._unsubscribeAll = new Subject();
  }


// create avatar YK like microsoft teams
    generateInitials(firstName: string, lastName: string): string {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}
 formatMobile(mobile: string): string {
    return mobile.match(/.{1,2}/g).join(' ');
  }
calculateAge(dateOfBirth: Date): number {
    const birthday = new Date(dateOfBirth);
    const ageDiffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiffMs); // Epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    // Reset ng-select on search
    this.selectedStatus = this.selectStatus[0];

    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (data) {
      return data.lastName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByStatus(event) {
    const filter = event ? event.value : '';
    this.previousStatusFilter = filter;
    this.tempFilterData = this.filterRows(filter);
    this.rows = this.tempFilterData;
  }
   filterByProfil(event) {
    const filter = event ? event.value : '';
    this.previousProfilFilter = filter;
    this.tempFilterData = this.filterRowsProfil(filter);
    this.rows = this.tempFilterData;
  }

  /**
   * Filter Rows
   *
   * @param statusFilter
   */
  filterRows(statusFilter): any[] {
    // Reset search on select change
    this.searchValue = '';

    statusFilter = statusFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isPartialNameMatch = row.workStatus.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
      return isPartialNameMatch;
    });
  }
   /**
   * Filter Rows
   *
   * @param profilFilter
   */
  filterRowsProfil(profilFilter): any[] {
    // Reset search on select change
    this.searchValue = '';

    profilFilter = profilFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isPartialNameMatch = row.realProfil.toLowerCase().indexOf(profilFilter) !== -1 || !profilFilter;
      return isPartialNameMatch;
    });
  }
createFullName(lastName:string,firstName:string){
  const fullNamePattern=lastName+'_'+firstName;
  return fullNamePattern;
}
dirigerAddMember(){
  const acronyme=this.acronyme;
  const name=this.name;
  this.router.navigate(['dashboard/addMember'],{state: {acronyme,name}})
  
}
 refreshPage(){
    window.location.reload();
 }
deleteUser(email:string){
  this._invoiceListService.deleteUser(email).subscribe(
      {
         next: (response) => {
          console.log(response);
           this.refreshPage();
      },
      error: (error) => {
        console.log('Error deleting user error');
      }
      }
     )
}
hasRoleManger(){
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
  if(this.currentUser.realProfil=="SCRUM_MASTR")
    return true;
  return false;
}
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe config change
      // If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
          this.currentUser=JSON.parse(localStorage.getItem("currentUser"));
          this._invoiceListService.getDataTableRows(this.acronyme).then(response => {
            console.log("is my response")
            
            this.data = response;
            
            this.rows = this.data;
            console.log(this.rows[0])
            this.tempData = this.rows;
            this.tempFilterData = this.rows;
          });
       
      
    
  }
  dirigerEditUserPage(user:any){
    this.router.navigate(['dashboard/editMember'],{ state: { user } })
  }
 modalOpenVC(modalVC) {
    this.modalService.open(modalVC, {
      centered: true
    });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
