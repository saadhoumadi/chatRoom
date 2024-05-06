import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss']
})
@Injectable({ providedIn: 'root' })
export class HelperComponent implements OnInit {
  public pipe = new DatePipe('en-US');


  constructor() { }

  ngOnInit(): void {
  }
  //methods
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

}
