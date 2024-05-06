import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from 'app/auth/models';
import { Subject } from 'rxjs';
import { ProfileService } from '../profile.service';
import { DomSanitizer } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import Stepper from 'bs-stepper';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-apropos',
  templateUrl: './apropos.component.html',
  styleUrls: ['../profile.component.scss','../../../forms/form-wizard/form-wizard.component.scss']
})
export class AproposComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('annuler') btnAnnulerSuppression!: ElementRef;
  // public
  public TDNameVar;
  public TDEmailVar;
  public TDFirstNameVar;
  public TDLastNameVar;
  public twitterVar;
  public facebookVar;
  public googleVar;
  public linkedinVar;
  public landmarkVar;
  public addressVar;

  public selectBasic = [
    { name: 'UK' },
    { name: 'USA' },
    { name: 'Spain' },
    { name: 'France' },
    { name: 'Italy' },
    { name: 'Australia' }
  ];

  public selectMulti = [{ name: 'English' }, { name: 'French' }, { name: 'Spanish' }];
  public selectMultiSelected;


  private modernVerticalWizardStepper: Stepper;

  public currentUser:User;
  public userFullNamePattern:string;
  public hasProfilImage:boolean;

  public contentHeader: object;
  public data: any;
  public toggleMenu = true;
  public Monthly = false;
  public toggleNavbarRef = false;
  public loadMoreRef = false;
  public pipe = new DatePipe('en-US');
  
  // private
  private _unsubscribeAll: Subject<any>;

   

  /**
   * Constructor
   *
   * @param {PricingService} _pricingService
   */
  constructor(private modalService: NgbModal,private _pricingService: ProfileService, private sanitizer: DomSanitizer,private router:Router,private profileService:ProfileService) {
    this._unsubscribeAll = new Subject();
  }
 modalOpenDanger(modalDanger) {
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: 'modal modal-danger'
    });
  }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Load More
   */
  loadMore() {
    this.loadMoreRef = !this.loadMoreRef;
    setTimeout(() => {
      this.loadMoreRef = !this.loadMoreRef;
    }, 2000);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     this.userFullNamePattern=this.currentUser.lastName+'_'+this.currentUser.firstName;
    this.hasProfilImage=this.currentUser.hasProfilImage;
    this._pricingService.onPricingChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.data = response;
    });

    // content header
    this.contentHeader = {
      headerTitle: 'Profile',
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
            name: 'Profile',
            isLink: false
          }
        ]
      }
    };


   

    this.modernVerticalWizardStepper = new Stepper(document.querySelector('#stepper4'), {
      linear: false,
      animation: true
    });


    // content header
    this.contentHeader = {
      headerTitle: 'Form Wizard',
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
            name: 'Forms',
            isLink: true,
            link: '/'
          },
          {
            name: 'Form Wizard',
            isLink: false
          }
        ]
      }
    };
  }
   displayFileInput(){
    this.fileInput.nativeElement.click()
  }
 changeProfilImage(){
     const firstName=this.currentUser.firstName;
     const lastName=this.currentUser.lastName;
     const file=this.fileInput.nativeElement.files[0];

     const input:any={
      "image":file,
      "firstName":firstName,
      "lastName":lastName
     }
     this.profileService.changeProfilImage(input).subscribe(response=>{
 this.currentUser.hasProfilImage = true;
    const currentUserData = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUserData) {
      currentUserData.hasProfilImage = true;
            console.log(currentUserData);

      localStorage.setItem("currentUser", JSON.stringify(currentUserData));
    }
     this.refreshPage()
     }, error => {
        console.error('Erreur lors du changement de l\'image de profil :', error);
      });
 }
 deleteImage(){
  const email=this.currentUser.email;
   this.profileService.deleteProfilImage(email).subscribe(response=>{
    alert(response);

    const currentUserData = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUserData) {
      currentUserData.hasProfilImage = false;
      console.log(currentUserData);
      localStorage.setItem("currentUser", JSON.stringify(currentUserData));
      this.refreshPage();
    }
  })
 }
  refreshPage(){
    window.location.reload();
 }
  dirigerActivites(){
    this.router.navigate(["/pages/profile"])
  }
  // create avatar YK like microsoft teams
    generateInitials(firstName: string, lastName: string): string {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}
// formating helpers
formatDate(date:Date):string{
       const formattedDate:string=this.pipe.transform(date, 'dd/MM/yyyy');
       return formattedDate;
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
  // end formatting helpers
/**
   * Modern Vertical Wizard Stepper Next
   */
  modernVerticalNext() {
    this.modernVerticalWizardStepper.next();
  }
  /**
   * Modern Vertical Wizard Stepper Previous
   */
  modernVerticalPrevious() {
    this.modernVerticalWizardStepper.previous();
  }

  /**
   * On Submit
   */
  onSubmit() {
    alert('Submitted!!');
    return false;
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



