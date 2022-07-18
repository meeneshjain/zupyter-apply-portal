import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";

@Component({
  selector: 'app-account-verify',
  templateUrl: './account-verify.component.html',
  styleUrls: ['./account-verify.component.scss']
})

export class AccountVerifyComponent implements OnInit {


  public common_params = new CommonFunctions();
  public show_loader = false;
  public show_profile_loader = false;
  public d = new Date();
  public instant_form_data:any = {};
  public micro_form_data: any = {};
  public current_date = (this.d.getMonth() + 1) + '/' + this.d.getDate() + '/' + this.d.getFullYear()

  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService
  ) {
    
  }

  ngOnInit() {
    this.common_service.check_session_on();
    this.show_loader = true;
    setTimeout(() => {
      this.show_loader = false;
      
    }, 1000);
  }
  
  on_instant_click(add_instant_popup){
    this.common_service.openModal(add_instant_popup, 'modal-md')
  }
  
  
  on_micro_click(add_micro_popup){
    this.common_service.openModal(add_micro_popup, 'modal-lg')
  }
  

  
  
  onInstantSubmit(instantForm_valid){
    
  }
  
  onDepositSubmit(depositForm_valid){
    
  }

}
