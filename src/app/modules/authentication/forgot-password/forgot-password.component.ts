import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public common_params = new CommonFunctions();
  public show_loader = false;
  public form_data: any = {};
  public module_id = 0;
  public pass_change_request_sent: any = 'f';
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
  }

  onSubmit(isValid: Boolean, type) {
    console.log('isValid ', isValid)
    console.log('this.form_data ', this.form_data);

    if (isValid) {
      this.show_loader = true;
      if (type == 1) {
        this.forgot_call()
      } else {
        this.opt_call()
      }
    }
  }

  forgot_call() {
    this.service.forgot_password(this.form_data.email_address).subscribe(response => {
      if (response['Message'] != undefined) {
        if (response['Message'] == 'True' || response['Message'] == 'true') {
          sessionStorage.setItem("password_change_email", this.form_data.email_address);
          this.pass_change_request_sent = 'o';
          this.common_service.show_sweet_alert('s', '', `Email to change password is sent successfully, please check your email ID `);
        } else {
          if (response['Message'] == 'no_user') {
            this.common_service.show_sweet_alert('e', '', "This user doesnt exists, please contact administrator.");
          }
        }
      } else {
        this.common_service.show_sweet_alert('e', '', this.common_service.error_message);
      }

      setTimeout(() => {
        this.show_loader = false;
      }, 500);
    }, error => {
      this.show_loader = false;
      this.common_service.show_sweet_alert('e', '', this.common_service.error_message);
    });
  }

  opt_call() {
    this.service.validate_otp(this.form_data.email_address, this.form_data.user_password, 'F').subscribe(response => {
      if (response['Message'] != undefined) {
        if (response['Message'] == 'True' || response['Message'] == 'true') {
          this.common_service.show_sweet_alert('s', '', `OTP verified successfully.`);
          this.common_service.change_route('/auth/change-password/F');
        } else {
          if (response['Message'] == 'otp_expired') {
            this.common_service.show_sweet_alert('e', '', "The entered OTP is expired.");
          }

          if (response['Message'] == 'invalid_otp') {
            this.common_service.show_sweet_alert('e', '', "The entered OTP is invalid.");
          }
        }
      } else {
        this.common_service.show_sweet_alert('e', '', this.common_service.error_message);
      }
      setTimeout(() => {
        this.show_loader = false;
      }, 500);
    }, error => {
      this.show_loader = false;
      this.common_service.show_sweet_alert('e', '', this.common_service.error_message);
    });
  }
}
