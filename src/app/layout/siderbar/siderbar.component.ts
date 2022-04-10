import { Component, OnInit } from '@angular/core';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";
@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrls: ['./siderbar.component.scss']
})
export class SiderbarComponent implements OnInit {
  public common_params = new CommonFunctions();
  public fullname = '';
  constructor(
    public common_service: CommonService,
    public service: MainService,
    public shared_service: SharedService,

  ) {
    
    this.shared_service.loginValueData.subscribe((obj) => {
      if (sessionStorage!= undefined){
        if (sessionStorage.user_details!= undefined){
          let user_detail = JSON.parse(sessionStorage.user_details)      
          this.fullname = user_detail.FirstName + ' ' + user_detail.LastName
        }
      }
    });
  }

  ngOnInit(): void {
    
    let user_detail = JSON.parse(sessionStorage.user_details)
    this.fullname = user_detail.FirstName + ' ' + user_detail.LastName
    
  }

}
