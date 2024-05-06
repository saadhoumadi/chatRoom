import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';

import { AccountSettingsService } from 'app/main/pages/account-settings/account-settings.service';
import Stepper from 'bs-stepper';
import { User } from 'app/auth/models';
import { DatePipe } from '@angular/common';
import { ChangePassword1 } from './model/ChangePassword1';
import { ChangePassword2 } from './model/ChangePassword2';
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  //private
  // public
  public currentUser:User;
  public userFullNamePattern:string;
  public hasProfilImage:boolean=false;
  public inputChangePasswordStep1:ChangePassword1;
  public inputChangePasswordStep2:ChangePassword2;

    private verticalWizardStepper: Stepper;
  private bsStepper;
  public pipe = new DatePipe('en-US');

  public contentHeader: object;
  public data: any;
  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public avatarImage: string;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {AccountSettingsService} _accountSettingsService
   */
  constructor(private _accountSettingsService: AccountSettingsService) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
 verticalWizardNext() {
    this.verticalWizardStepper.next();
  }
  triggerChangePasswordStep1(){
    this._accountSettingsService.changePasswordStep1(this.inputChangePasswordStep1).subscribe({
      next :(response)=>{
        if(response){
          this.verticalWizardStepper.next();
        }
        else{
          alert("mot de passe incorrecte");
        }
      }
    })
  }
   triggerChangePasswordStep2(){
    this._accountSettingsService.changePasswordStep2(this.inputChangePasswordStep2).subscribe({
      next :(response)=>{
        if(response){
          console.log(response)
          alert(response);
        }
        else{
          alert("mot de passe incorrecte");
        }
      }
    })
  }
  /**
   * Vertical Wizard Stepper Previous
   */
  verticalWizardPrevious() {
    this.verticalWizardStepper.previous();
  }
  /**
   * Toggle Password Text Type Old
   */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }
formatDate(date:Date):string{
       const formattedDate:string=this.pipe.transform(date, 'dd/MM/yyyy');
       return formattedDate;
}
  formatMobile(mobile: string): string {
    return mobile.match(/.{1,2}/g).join(' ');
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
   calculateAge(dateOfBirth: Date): number {
    const birthday = new Date(dateOfBirth);
    const ageDiffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiffMs); // Epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
   


     this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     console.log(this.currentUser.email)
     this.userFullNamePattern=this.currentUser.lastName+'_'+this.currentUser.firstName;
    this.hasProfilImage=this.currentUser.hasProfilImage;
        this.bsStepper = document.querySelectorAll('.bs-stepper');
 this.inputChangePasswordStep1=new ChangePassword1;
    this.inputChangePasswordStep2=new ChangePassword2;

    this.inputChangePasswordStep1.email=this.currentUser.email;
    this.inputChangePasswordStep2.email=this.currentUser.email;
    this._accountSettingsService.onSettingsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.data = response;
      this.avatarImage = this.data.accountSetting.general.avatar;
    });
this.verticalWizardStepper = new Stepper(document.querySelector('#stepper2'), {
      linear: false,
      animation: true

    });
    // content header
    this.contentHeader = {
      headerTitle: 'Account Settings',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Pages',
            isLink: true,
            link: '/'
          },
          {
            name: 'Account Settings',
            isLink: false
          }
        ]
      }
    };
  }
changePasswordStep1(){
  
 
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
