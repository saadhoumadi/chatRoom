import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProfileService } from 'app/main/pages/profile/profile.service';
import { User } from 'app/auth/models';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('annuler') btnAnnulerSuppression!: ElementRef;
  // public
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
  private mySubscription;

   

  /**
   * Constructor
   *
   * @param {PricingService} _pricingService
   */
  constructor(private modalService: NgbModal,private _pricingService: ProfileService, private sanitizer: DomSanitizer,private router:Router,private profileService:ProfileService,private activatedRoute:ActivatedRoute) {
    this._unsubscribeAll = new Subject();

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
         // Trick the Router into believing it's last link wasn't previously loaded
         this.router.navigated = false;
      }
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
  // end formatting helpers

  /**
   * On destroy
   */
 
  dirigerApropos():void{
    this.router.navigate(["pages/apropos"])
  }
 refreshPage(){
    window.location.reload();
 }
   modalOpenDanger(modalDanger) {
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: 'modal modal-danger'
    });
  }
   ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
        this.mySubscription.unsubscribe();

  }
}
