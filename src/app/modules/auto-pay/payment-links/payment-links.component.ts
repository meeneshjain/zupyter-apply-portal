import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, Event, NavigationStart, ActivatedRoute, NavigationEnd, NavigationError } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";


@Component({
  selector: 'app-payment-links',
  templateUrl: './payment-links.component.html',
  styleUrls: ['./payment-links.component.scss']
})
export class PaymentLinksComponent implements OnInit {


  public common_params = new CommonFunctions();
  public show_loader = false;
  public dataSource = [];
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService
  ) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {

      }
    });
  }

  ngOnInit() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.common_service.check_session_on();
    
    this.show_loader = true;
    setTimeout(() => {
      this.show_loader = false;

    }, 1000);
  }
  
  on_instant_click(add_instant_popup) {
    this.common_service.openModal(add_instant_popup, 'modal-md')
  }
  
  onAutoPaySubmit(instantForm_valid) {

  }

}
