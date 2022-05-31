import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public common_params = new CommonFunctions();
  public show_loader = false;
  public form_data: any = {};
  public transaction_details = [];
  public selected_transaction = {};
  
  public isMobile = this.deviceService.isMobile();
  public isTablet = this.deviceService.isTablet();
  public isDesktopDevice = this.deviceService.isDesktop();
  
  
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
    public shared_service: SharedService,
    private deviceService: DeviceDetectorService
  ) { }

  ngOnInit() {
    this.common_service.check_session_on();
    this.show_loader = true;
    this.get_completed_transaction()
  }
  
  get_completed_transaction() {
    this.service.get_completed_transaction(-1, -1, 'H', 5).subscribe((res) => {
      console.log('res ', res)
      if (res != null) {
        if (res.data != undefined && res.data.length > 0) {
          this.transaction_details = res.data;
        }
      }
      this.show_loader = false;
    }, error => {
      this.show_loader = false;
      this.common_service.show_sweet_alert('e', "", this.common_service.error_message);
    });
  }
  
  show_transaction_details(activitydetailpopup , row_data){
    this.selected_transaction = row_data
    console.log('row_data ', row_data )
    this.common_service.openModal(activitydetailpopup, 'modal-lg')
  }
  
  close_transaction(){
    this.common_service.closeModal('') 
    setTimeout(() => {
      this.selected_transaction = {};
    }, 10);
  }

}
