import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { repeaterAnimation } from 'app/main/forms/form-repeater/form-repeater.animation';

import Stepper from 'bs-stepper';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserAddDTO } from './model/UserAddDTO';
import { InvoiceAddService } from './invoice-add.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invoice-add',
  templateUrl: './invoice-add.component.html',
  styleUrls: ['./invoice-add.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceAddComponent implements OnInit, OnDestroy {
  @ViewChild('btnModal') btnModal:any;

  public userAdd:UserAddDTO;
  public acronyme:string;
  public name:string;
  // public
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
  constructor(private modalService: NgbModal,private _invoiceAddService: InvoiceAddService, private _coreSidebarService: CoreSidebarService,private fb : FormBuilder) {
    this._unsubscribeAll = new Subject();
    this.userAdd=new UserAddDTO();
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
    this.acronyme=history.state.acronyme;
    this.name=history.state.name;
    this.userAdd.teamAcronyme=this.acronyme;
    // alert(this.acronyme)
    // alert(this.name)
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
    this.userAdd.workStatus = event.name;
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
 
onSubmit(){
  // alert(this.userAdd.teamAcronyme)
  console.log(this.userAdd.profilsTest)
  console.log(this.userAdd.workStatusTest)
  this.userAdd.workStatus=this.userAdd.workStatusTest.name;

  this.userAdd.profils=[];
  for(const item of this.userAdd.profilsTest){
        console.log(item)
        this.userAdd.profils.push(item.name);
        console.log(this.userAdd.profils);
  }

    console.log(this.userAdd.profils)
  console.log(this.userAdd.workStatus)
  
    this._invoiceAddService.addUser(this.userAdd).subscribe(
     (data) => {
      if(data){
         console.log(data)   
         this.btnModal.nativeElement.click()  
      }
   }
       );

  }

    // modal Open Vertically Centered
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
