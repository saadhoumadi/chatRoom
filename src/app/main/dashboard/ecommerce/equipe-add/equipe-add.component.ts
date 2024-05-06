import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { repeaterAnimation } from 'app/main/forms/form-repeater/form-repeater.animation';
import * as snippet from 'app/main/forms/form-layout/form-layout.snippetcode';
import Stepper from 'bs-stepper';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipeAddService } from './equipe-add.service';
import { DatePipe } from '@angular/common';
import { TeamAddDTO } from './model/TeamAddDTO';

@Component({
  selector: 'app-equipe-add',
  templateUrl: './equipe-add.component.html',
  styleUrls: ['./equipe-add.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None
})
export class EquipeAddComponent implements OnInit, OnDestroy {
  @ViewChild('btnModal') btnModal:any;


  public teamAdd:TeamAddDTO;
  public departmens;
  // public
  public apiData;
  public sidebarToggleRef = false;
  public invoiceSelect;
  public invoiceSelected;

    public _snippetCodeVertical = snippet.snippetCodeVertical;  
    public _snippetCodeVertiacalIcons = snippet.snippetCodeVertiacalIcons;
    public pipe = new DatePipe('en-US');
    public dateNow:Date=new Date;

    private verticalWizardStepper: Stepper;
    public selectWorkStatus = [{ name: 'OFFICE' }, { name: 'HOLLIDAY' }, { name: 'MISSION' }];
    public selectMultiSelected;




  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {EquipeAddService} equipeAddService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private modalService: NgbModal,private equipeAddService: EquipeAddService, private _coreSidebarService: CoreSidebarService,private fb : FormBuilder) {
    this._unsubscribeAll = new Subject();
    this.teamAdd=new TeamAddDTO();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Add Item
   */

  /**
   * DeleteItem
   *
  

  /**
  
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.getAllDepartment();
    this.verticalWizardStepper = new Stepper(document.querySelector('#stepper2'), {
      linear: false,
      animation: true
    });

    this.equipeAddService.onInvoicAddChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      let responseData = response;
      this.apiData = responseData.slice(5, 10);
    });
    this.invoiceSelect = this.apiData;
    this.invoiceSelected = this.invoiceSelect;
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

  getAllDepartment(){
     this.equipeAddService.getAllDepartment().subscribe(
      {
         next: (departments) => {
          this.departmens=departments;
        console.log(departments)
      },
      error: (error) => {
        console.log('Error searching users:', error);
      }
      }
     )
  }
addTeam(){
    this.equipeAddService.addTeam(this.teamAdd).subscribe(
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
