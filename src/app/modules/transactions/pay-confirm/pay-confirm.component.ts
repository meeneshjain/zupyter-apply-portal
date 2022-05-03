import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";



@Component({
  selector: 'app-pay-confirm',
  templateUrl: './pay-confirm.component.html',
  styleUrls: ['./pay-confirm.component.scss']
})
export class PayConfirmComponent implements OnInit {

  public common_params = new CommonFunctions();
  public show_loader = false;
  public show_profile_loader = false;
  public form_data: any = {};
  public pp_TransID:any = 0;
  public transaction_details = [];
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService
  ) { 
    sessionStorage.removeItem('transaction_data');
  }

  ngOnInit() {
    this.common_service.check_session_on();
    this.show_profile_loader = true
    this.show_loader = true;
    this.pp_TransID = this.ActivatedRoute.snapshot.paramMap.get('one');;
    this.get_completed_transaction(this.pp_TransID)
  }
  
  get_completed_transaction(pp_TransID) {
    this.service.get_completed_transaction(pp_TransID, -1, 'H', 1).subscribe((res) => {
      this.show_loader = false;
      console.log('res ', res )
      if (res != null) {
        if (res.data!= undefined && res.data.length > 0){
          this.transaction_details = res.data;
        }
      }
    }, error => {
      this.show_loader = false;
      this.common_service.show_sweet_alert('e', "", this.common_service.error_message);
    });
  }

}
