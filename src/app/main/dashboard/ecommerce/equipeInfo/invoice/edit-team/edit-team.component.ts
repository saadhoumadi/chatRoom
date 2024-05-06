import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { repeaterAnimation } from 'app/main/forms/form-repeater/form-repeater.animation';

import Stepper from 'bs-stepper';
import { FormBuilder } from '@angular/forms';
import { UserAddDTO } from './model/UserAddDTO';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditTeamService } from './edit-team.service';
import { DatePipe } from '@angular/common';
import { WorkStatus } from './model/WorkStatus';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-add',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None
})
export class EditTeamComponent implements OnInit, OnDestroy {
  @ViewChild('btnModal') btnModal:any;

  public userEdit:UserAddDTO;
  // public
    public pipe = new DatePipe('en-US');
  public apiData;
  public sidebarToggleRef = false;
  public invoiceSelect;
  public invoiceSelected;

    private verticalWizardStepper: Stepper;
    public selectWorkStatus = [{ name: 'OFFICE' }, { name: 'HOLLIDAY' }, { name: 'MISSION' }];
    public selectMultiSelected;

 public selectProfil = [
    { name: 'COLLABORATOR' },
    { name: 'TECH_LEAD' },
    { name: 'MANAGER' },
   { name: 'SCRUM_MASTER' },
  ];

  // public paymentDetails = {
  //   totalDue: '$12,110.55',
  //   bankName: 'American Bank',
  //   country: 'United States',
  //   iban: 'ETD95476213874685',
  //   swiftCode: 'BR91905'
  // };

  public items = [{ itemId: '', itemName: '', itemQuantity: '', itemCost: '' }];

  public item = {
    itemName: '',
    itemQuantity: '',
    itemCost: ''
  };

  // ng2-flatpickr options
  public dateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    defaultDate: ['2020-05-01'],
    altFormat: 'Y-n-j'
  };
  public dueDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    defaultDate: ['2020-05-17'],
    altFormat: 'Y-n-j'
  };

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {InvoiceAddService} _invoiceAddService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private modalService: NgbModal,private _invoiceAddService: EditTeamService,
     private _coreSidebarService: CoreSidebarService,private fb : FormBuilder,
     private router:Router
    ) {
    this._unsubscribeAll = new Subject();
    this.userEdit=new UserAddDTO();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Add Item
   */
  addItem() {
    this.items.push({
      itemId: '',
      itemName: '',
      itemQuantity: '',
      itemCost: ''
    });
  }

  /**
   * DeleteItem
   *
   * @param id
   */
  deleteItem(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items.indexOf(this.items[i]) === id) {
        this.items.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
this.userEdit = history.state.user;
this.userEdit.profilsTest=[]
    console.log(this.userEdit); 

    this.verticalWizardStepper = new Stepper(document.querySelector('#stepper2'), {
      linear: false,
      animation: true
    });

    this._invoiceAddService.onInvoicAddChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      let responseData = response;
      this.apiData = responseData.slice(5, 10);
    });
    this.invoiceSelect = this.apiData;
    this.invoiceSelected = this.invoiceSelect;
  }


  extractWorkStatusName(event: any) {
    this.userEdit.workStatus = event.name;
  }
  /**
   * Vertical Wizard Stepper Next
   */
  verticalWizardNext() {
    this.verticalWizardStepper.next();
  }
  /**
   * Vertical Wizard Stepper Previous
   */
  verticalWizardPrevious() {
    this.verticalWizardStepper.previous();
  }
 
async onSubmit(){
  console.log("workstatus nit touched")
  console.log(this.userEdit.workStatus);
    console.log(this.userEdit.workStatus)
    if(this.userEdit.workStatusTest!=undefined){
      this.userEdit.workStatus=this.userEdit.workStatusTest.name;
    }
    console.log("teste teste")
    console.log(this.userEdit.profilsTest)
    console.log(this.userEdit.profils)

 for(const item of this.userEdit.profilsTest){
        this.userEdit.profils.push(item.name);
  }


  
    await this._invoiceAddService.editUser(this.userEdit).subscribe(
     (updatedUser) => {
   
        console.log("updated user now is : ")
         console.log(updatedUser)   
         const acronyme=this.userEdit.teamAcronyme
         const name=this.userEdit.teamName;
         this.router.navigate(['dashboard/equipe'], { queryParams: { acronyme:acronyme ,name:name } });
   }
       );
         this.btnModal.nativeElement.click()  

  }

    // modal Open Vertically Centered
  modalOpenVC(modalVC) {
    this.modalService.open(modalVC, {
      centered: true
    });
  }
  formatDate(date:Date):string{
       const formattedDate:string=this.pipe.transform(date, 'dd/MM/yyyy');
       return formattedDate;
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
