import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";


@Component({
  selector: 'app-pay-now',
  templateUrl: './pay-now.component.html',
  styleUrls: ['./pay-now.component.scss']
})
export class PayNowComponent implements OnInit {

  public common_params = new CommonFunctions();
  public show_loader = false;
  public show_profile_loader = false;
  public form_data: any = {};
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService
  ) { }

  ngOnInit() {
    this.common_service.check_session_on();
    this.show_profile_loader = true
    this.show_loader = true;
    this.form_data.selected_card = '';
    this.form_data.selected_bank = '';
    setTimeout(() => {
      this.show_loader = false;
      this.show_profile_loader = false;
    }, 2500);
  }
  
  continue_pay(){
    this.common_service.change_route('transaction/pay-confirm/11');
  }
  
  PayNowSubmit(isValid: Boolean) {
    
  }


}
