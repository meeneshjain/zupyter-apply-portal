import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import * as $ from 'jquery'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
 
})
export class AppComponent {
  title = 'payment-portal';
  
  showHeader = false;
  showSidebar = false;
  showFooter = false;
  
  
  ngOnInit() {
   /*  console.log(`jQuery version: ${$.fn.jquery}`);
    $(".flyout_css").html(` .btn-primary{
        background  : blue !important;
      }`); */
  }
}
