import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-resume-app',
  templateUrl: './resume-app.component.html',
  styleUrls: ['./resume-app.component.scss']
})
export class ResumeAppComponent implements OnInit {


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
    setTimeout(() => {
      this.show_loader = false;
    }, 500);
  }
  

  go_to_dashboard() {
    this.common_service.change_route('/get-started')
  }


  OnResumeSubmit(isValid: Boolean) {
    if (isValid) {

      this.show_loader = true;
      this.service.get_application(-1, '', this.resume_form.email, this.resume_form.phone).subscribe(res => {
        if (res!= null){
          if (res['data'] != undefined && res['data'].length > 0) {
            let resume_id = res['data'][0]['Lead_id']
            // this.common_service.show_sweet_alert('s', "Application found", "");
            this.show_loader = false;
            let router_link = 'application/resume/' + resume_id;
            this.common_service.change_route(router_link)
  
          } else {
            this.show_loader = false;
            this.common_service.show_sweet_alert('e', "Error!", 'No application found');
          }
        } else {
          this.show_loader = false;
          this.common_service.show_sweet_alert('e', "Error!", 'No application found');
        }
        console.log('res ', res)

      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", this.common_service.error_message);
      });

    }
  }

}
