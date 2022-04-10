import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public common_params = new CommonFunctions();
  public show_loader = false;
  public form_data: any = {};
  public module_id = 0;
  public email_address = "";
  public screen_type = "";
  public password_field_type0 = "password";
  public password_field_type1 = "password";
  public password_field_type2 = "password";
  
  public password_view_icon0 = "fa fa-eye";
  public password_view_icon1 = "fa fa-eye";
  public password_view_icon2 = "fa fa-eye";
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
    public shared_service: SharedService
  ) { }

  ngOnInit() {

    this.show_loader = true;
    setTimeout(() => {
      this.show_loader = false;
    }, 300);
    
    this.email_address = (sessionStorage.password_change_email != undefined && sessionStorage.password_change_email != "" && sessionStorage.password_change_email != null) ? sessionStorage.password_change_email : "";

    if (this.email_address == "") {
      this.common_service.show_sweet_alert('e',"", "Cannot access this page, the following page is expired.");
      this.common_service.change_route(['/authentication/login']);
    }
    this.screen_type = this.ActivatedRoute.snapshot.paramMap.get('one');
  }
  

  password_toggle(type) {
    if (type == '0') {
      if (this.password_field_type0 == "password") {
        this.password_field_type0 = "text";
        this.password_view_icon0 = "fa fa-eye-slash";
      } else {
        this.password_field_type0 = "password";
        this.password_view_icon0 = "fa fa-eye";
      }
    } else if (type == '1') {
      if (this.password_field_type1 == "password") {
        this.password_field_type1 = "text";
        this.password_view_icon1 = "fa fa-eye-slash";
      } else {
        this.password_field_type1 = "password";
        this.password_view_icon1 = "fa fa-eye";
      }
    } else if (type == '2') {
      if (this.password_field_type2 == "password") {
        this.password_field_type2 = "text";
        this.password_view_icon2 = "fa fa-eye-slash";
      } else {
        this.password_field_type2 = "password";
        this.password_view_icon2 = "fa fa-eye";
      }
    }
  }
  
  onSubmit(isValid: Boolean, type) {
    console.log('isValid ', isValid)
    console.log('this.form_data ', this.form_data);

    if (isValid) {
      this.show_loader = true;
      this.service.change_new_password(this.email_address, this.form_data.new_password, this.screen_type, "", this.form_data.temporary_password).subscribe(response => {
        if (response['Message'] != undefined) {
          if (response['Message'] == 'True' || response['Message'] == 'true') {
            sessionStorage.setItem("password_change_email", this.email_address);
            this.common_service.show_sweet_alert('s', "", `Your password changed successfuly. `);
            this.login_click();
          } else {
            if (response['Message'] == 'otp_expired') {
              this.common_service.show_sweet_alert('e', "", "The OTP used is expired please try again.");
              this.common_service.change_route('/auth/forgot-password');
            }

            if (response['Message'] == 'invalid_pass') {
              this.common_service.show_sweet_alert('e', "", "You have entered your temporary password wrong, please try again, .");
              this.form_data.temporary_password = "";
            }
          }
        } else {
          this.common_service.show_sweet_alert('e', "", this.common_service.error_message);
        }

        setTimeout(() => {
          this.show_loader = false;
        }, 500);
      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "", this.common_service.error_message);
      });
    }
  }
  
  login_click() {
    sessionStorage.removeItem("password_change_email");
    this.common_service.change_route('/auth/sign-in');
  }

  
}
