import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";


@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.scss']
})
export class ProfileSettingComponent implements OnInit {
  public common_params = new CommonFunctions();
  public show_loader = false;
  public form_data: any = {};
  public module_id = 0;
  public email_address = "";
 public fullname = '';
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService
  ) { }

  ngOnInit(): void {
    let user_detail = JSON.parse(sessionStorage.user_details)
    this.fullname = user_detail.FirstName + ' ' + user_detail.LastName
    this.get_profile(); 
  }
  
  get_profile(){
    this.show_loader = true;
    let userd = JSON.parse(sessionStorage.user_details)
    this.service.get_accounts(-1, userd['CardCode'], 1, 100).subscribe((res) => {
      this.show_loader = false;
      console.log('res ', res )
    }, error => {
      this.show_loader = false;
      this.common_service.show_sweet_alert('e', "", this.common_service.error_message);
    });
  }
  
  onSubmit(isValid: Boolean, type) {
    console.log('isValid ', isValid)
    console.log('this.form_data ', this.form_data);

    if (isValid) {
      this.show_loader = true;
    }
  }


}
