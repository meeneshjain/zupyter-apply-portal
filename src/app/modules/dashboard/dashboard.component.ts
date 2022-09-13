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
  public date = new Date();
  public login_logo = '';
  public config_data;
  public module_id = 0;

  public resume_form: any = {};

  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
    public shared_service: SharedService,
    private deviceService: DeviceDetectorService
  ) { }


  ngOnInit() {
    this.show_loader = true;
    
    this.shared_service.loginValue(false);

    this.login_logo = this.common_params.default_login_image
    if (sessionStorage.general_setting != undefined) {
      let general = JSON.parse(sessionStorage.general_setting);
      if (general != undefined) {
        this.login_logo = general.LoginScrLogo;
      }
    }

    this.service.get_config((config_data) => {
      this.config_data = JSON.parse(config_data);
      this.service.get_mod_list().subscribe(mod_response => {
        let module_list = (mod_response['data'] !== undefined) ? mod_response['data'] : [];
        sessionStorage.setItem("module_list", JSON.stringify(module_list));
        this.module_id = this.common_params.get_module_id('Customer Portal');
        this.show_loader  = false;
      }, error => {
        this.show_loader = false;

      });

      this.service.get_general_settings().subscribe(general_setting_response => {
        if (general_setting_response != undefined && general_setting_response.data != undefined) {
          sessionStorage.setItem("general_setting", JSON.stringify(general_setting_response.data[0]));
          this.shared_service.GeneralValue(true);
        }
        this.show_loader = false;
      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", this.common_service.error_message);
      });
    });
  }

  on_application_click(type, popupobject) {
    var router_link = ''; 
    if(type == '1'){
      router_link = 'application/new';
    } else if (type == '2') {
      this.common_service.openModal(popupobject, 'modal-md')
      // router_link = 'application/resume';
    }
    
    this.common_service.change_route(router_link)
  }

  onAutoPaySubmit(instantForm_valid) {

  }
  
  OnResumeSubmit(isValid: Boolean) {
    if (isValid) {
      this.common_service.closeModal('')
      let router_link = 'application/resume';
      this.common_service.change_route(router_link)
    }
  }

  
 
}