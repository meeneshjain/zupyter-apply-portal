import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public common_params = new CommonFunctions();
  public show_loader = false;
  public form_data: any = {};
  public config_data;
  public module_id = 0;
  public password_field_type = 'password';
  public pass_icon = 'fa fa-eye';
  public login_logo = '';

  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
    public shared_service: SharedService

  ) { 
    
    this.shared_service.generalValueData.subscribe((obj) => {
      if (obj === true) {
        let general = JSON.parse(sessionStorage.general_setting);
        this.login_logo = general.LoginScrLogo;
      }
    });
  }

  ngOnInit() {
    this.show_loader = true;
    this.common_service.signout();
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
     }, error => {
        this.show_loader = false;

      });
      
      this.service.get_general_settings().subscribe(general_setting_response => {
        if (general_setting_response != undefined && general_setting_response.data != undefined ){
          sessionStorage.setItem("general_setting", JSON.stringify(general_setting_response.data[0]));
          this.shared_service.GeneralValue(true);
        }
        this.service.get_payment_portal().subscribe(response => {
          sessionStorage.removeItem('pay_portal_setting')
          sessionStorage.setItem("pay_portal_setting", JSON.stringify(response));
          this.shared_service.PayPortalValue(true);
          setTimeout(() => {
            this.show_loader = false;
          }, 150);
        }, error => {
          this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", this.common_service.error_message);
        });
      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", this.common_service.error_message);
      });
    });
  }

  onSubmit(isValid: Boolean) {
    console.log('isValid ', isValid)
    if (isValid) {
      this.show_loader = true;
      this.service.check_login(this.form_data.email_address, this.form_data.user_password).subscribe(user_id => {
        if (user_id > 0) {

          this.service.get_user_details(user_id, this.module_id).subscribe(response => {
            if (response[0]['Active'] == true ) {
                this.set_session_redirect(response, user_id);
            } else {
              this.common_service.show_sweet_alert_adv('e', 'Your account is on hold', "Contact Om Produce accounting Team at accounting@omproduce.com or call us at +1 (214) 233-3500. We truly appreciate your business and want to resume shipments as soon as possible.", () => {

              }, "");
            }
          }, error => {
            this.show_loader = false;
            this.common_service.show_sweet_alert('e', "Error!", "There was some error, Please try again.");
          });
        } else {
          this.show_loader = false;
          this.common_service.show_sweet_alert('e', "Warning!", "Invalid Email Address & Password, Please try again.");
        }
      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", this.common_service.error_message);
      });

    }
  }

  set_session_redirect(response, user_id) {
    if (response[0]['ChangePass'] == true) {
      sessionStorage.setItem("password_change_email", this.form_data.email_address);
      this.common_service.show_sweet_alert('i', '', `For security reasons, Please change you password`);
      this.common_service.change_route('/auth/change-password/I');
    } else {
      sessionStorage.setItem("is_logged_in", '1');
      sessionStorage.setItem("user_id", user_id);
      sessionStorage.setItem("AccessType", response[0]['AccessType']);
     
      sessionStorage.setItem("user_details", JSON.stringify(response[0]));
      /* this.common_service.show_sweet_alert('s', '', `Welcome ${response[0]['FirstName']}`); */
      this.shared_service.loginValue(true);
      this.common_service.change_route('/dashboard');
    }
  }
  
  change_field_visibility(){
    if (this.password_field_type == 'password'){
      this.password_field_type = 'text';
      this.pass_icon = 'fa fa-eye-slash'; 
    } else {
      this.password_field_type = 'password'; 
      this.pass_icon = 'fa fa-eye'; 
    }
  }

}
