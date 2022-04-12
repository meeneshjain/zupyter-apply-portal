import { Component, OnInit } from '@angular/core';
import { SharedService } from "src/app/core/services/shared.service";
import { MainService } from "src/app/core/services/main.service";
import { CommonService } from "src/app/core/services/common.service";
import { CommonFunctions } from "src/app/core/helpers/common.functions";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public common_params = new CommonFunctions();
  public load_menu = false;
  public is_logged_in = false;
  public login_logo = '';
  constructor(
    public shared_service: SharedService,
    public common_service: CommonService,
    public service: MainService
  ) { 
    setTimeout(() => {
      this.load_menu = true;
    }, 200);
    
    this.shared_service.loginValueData.subscribe((obj) => {
        this.is_logged_in = obj;
      if (sessionStorage['is_logged_in']!= undefined){
        if (sessionStorage['is_logged_in'] == 1){
          this.is_logged_in = true;
        } else {
          this.is_logged_in = false;
        }
      }
    });
    
    this.shared_service.generalValueData.subscribe((obj) => {
      if (obj === true ) {
        let general = JSON.parse(sessionStorage.general_setting);
        this.login_logo = general.LoginScrLogo;
      } 
    });
  }
    

  ngOnInit(): void {
    this.login_logo = this.common_params.default_login_image
    if (sessionStorage.general_setting!= undefined){
      let general = JSON.parse(sessionStorage.general_setting);
      if (general!= undefined){
        this.login_logo = general.LoginScrLogo;
      }
      
      this.service.get_payment_portal().subscribe(response => {
        sessionStorage.removeItem('pay_portal_setting')
        sessionStorage.setItem("pay_portal_setting", JSON.stringify(response));
        this.shared_service.PayPortalValue(true);
      }, error => {
        this.common_service.show_sweet_alert('e', "Error!", this.common_service.error_message);
      });
    }
    
    setTimeout(() => {
      this.load_menu = true;
    }, 200);
  }

}
