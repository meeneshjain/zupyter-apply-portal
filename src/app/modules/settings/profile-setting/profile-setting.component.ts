import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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
  public pass_form_data: any = {};
  public module_id = 0;
  public email_address = "";
  public fullname = '';
  public country_list = [];
  public method: string;
  public user_detail

  public password_field_type1: string = '';
  public pass_icon1: string = 'fa fa-eye-slash';
  public password_field_type2: string = '';
  public pass_icon2: string = 'fa fa-eye-slash';

  @ViewChild('paymentprofilePopup') paymentprofilePopup;
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
  ) { }

  ngOnInit(): void {
    let user_detail = JSON.parse(sessionStorage.user_details)
    this.fullname = user_detail.FirstName + ' ' + user_detail.LastName
    this.service.get_contry_list((res) => {
      this.country_list = res.data;
    })

    this.form_data.pay_profile = {};



    this.get_profile();
  }

  change_field_visibility(field_number) {
    if (field_number == 1) {

      if (this.password_field_type1 == 'password') {
        this.password_field_type1 = 'text';
        this.pass_icon1 = 'fa fa-eye-slash';
      } else {
        this.password_field_type1 = 'password';
        this.pass_icon1 = 'fa fa-eye';
      }

    } else if (field_number == 2) {
      if (this.password_field_type2 == 'password') {
        this.password_field_type2 = 'text';
        this.pass_icon2 = 'fa fa-eye-slash';
      } else {
        this.password_field_type2 = 'password';
        this.pass_icon2 = 'fa fa-eye';
      }
    }
  }


  account_type_change(value) {
    if (value == 'saving') {
      this.form_data.pay_profile.ACTypeID = 1;
    }

    if (value == 'checking') {
      this.form_data.pay_profile.ACTypeID = 0;
    }

    if (value == 'business_checking') {
      this.form_data.pay_profile.ACTypeID = 2;
    }
  }


  get_profile() {
    let userd = JSON.parse(sessionStorage.user_details);
    if (userd['CardCode'] != null && userd['CardCode'] != "") {

      this.show_loader = true;
      this.service.get_payment_profile(userd['CardCode']).subscribe((res) => {
        this.show_loader = false;
        if (res != null) {
          if (res.data != undefined) {
            this.form_data = res.data[0];
            this.method = 'A'; // 'M';
            this.form_data.pay_profile = (this.form_data.PayProfiles.length > 0) ? this.form_data.PayProfiles[0] : {};
            this.generate_address(this.form_data.Addresses)
            console.log('this.form_data ', this.form_data)
            if (this.form_data.PayProfiles.length == 0) {
              this.method = 'A';
              this.form_data.pay_profile.PayType = 'BA';
              this.form_data.pay_profile.CustomerType = 'Individual';
              this.form_data.pay_profile.Active = ('True').toString();
              this.form_data.pay_profile.DefltPayProfile = 'True';
              this.form_data.pay_profile.Country = 'United States';
              console.log('this.form_data ', this.form_data)
              this.common_service.openModal(this.paymentprofilePopup, 'modal-xl')
            }

          }
        } else {
          this.method = 'A';
          this.common_service.openModal(this.paymentprofilePopup, 'modal-xl')
        }

      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "", this.common_service.error_message);
      });
    } else {
      this.common_service.show_sweet_alert('e', "", "Card Code not found, please try again ");

    }
  }

  generate_address(address_data) {
    let billto = address_data.filter(obj => {
      return obj.AdresType == 'B'
    });

    this.form_data.bill_to_address = billto[0]
    this.form_data.address_full = billto[0]['Street'] + '' + billto[0]['StreetNo'] + ' ' + billto[0]['Block'] + " " + billto[0]['City'] + " " + billto[0]['ZipCode'] + ", " + billto[0]['State'] + ", " + billto[0]['Country'];
  }

  onPaymentSubmit(isValid: Boolean) {
    console.log('isValid ', isValid)
    console.log('this.form_data ', this.form_data);

    if (isValid) {
      if (this.form_data.PayProfiles.length == 0) {
        let dataset = JSON.parse(JSON.stringify(this.form_data));
        if (dataset.pay_profile.PayType == 'CC') {
          dataset.pay_profile.ACName = '';
          dataset.pay_profile.ACTypeID = '';
          dataset.pay_profile.ACTypeName = '';
          dataset.pay_profile.ACABRouteNo = '';
          dataset.pay_profile.ACNumber = '';
          dataset.pay_profile.ACBank = '';
        } else {
          dataset.pay_profile.CardType = '';
          dataset.pay_profile.CardNumber = '';
          dataset.pay_profile.CardExpiry = '';
          dataset.pay_profile.CVV = '';
        }


        this.show_loader = true;
        this.service.create_payment_profile(this.method, dataset, dataset.pay_profile).subscribe(response => {
          console.log('response ', response);
          if (response.Errors != undefined && response.Errors.length > 0) {
            let err_msg = '';
            let err_msg_arr = [];
            for (let err of response.Errors) {
              err_msg_arr.push(`Error Code - ${err['errorcode']} ${err['errordesc']}`)
            }

            err_msg = err_msg_arr.join(', ')
            
            this.common_service.show_sweet_alert('e', "Errors!", `${err_msg}`);
            this.show_loader = false;
          }

          if (response.Message == 'true' || response.Message == 'True') {
            this.show_loader = false;
            this.common_service.show_sweet_alert('s', "Success!", 'Payment Profile Saved Successfully');
            this.get_profile()
            this.common_service.closeModal('');
            
          }



        }, error => {
          this.show_loader = false;
          this.common_service.show_sweet_alert('e', "Error!", "There was some error, Please try again.");
        });
      }
    }
  }

  change_pay_typ(value) {
    this.form_data.pay_profile.PayType = value;
  }

  onSubmit(isValid: Boolean) {
    console.log('isValid ', isValid)
    if (isValid) {
    }
  }

  onChangePassSubmit(isValid: Boolean) {
    console.log('isValid ', isValid)
    if (isValid) {
      if (this.pass_form_data.new_password == this.pass_form_data.confirm_new_password) {
        this.service.change_password(this.pass_form_data.confirm_new_password).subscribe(response => {
          if (response.Message == 'true' || response.Message == 'True') {
            this.common_service.show_sweet_alert('s', 'Success!', "Password Changed Successfully.");
            setTimeout(() => {
              this.pass_form_data = {};
              this.common_service.closeModal('');
            }, 50);
          } else {
            if (response.Message == 'wrong_pass') {
              this.common_service.show_sweet_alert('i', 'Info!', "Current Password is wrong, please enter corrent current password. ");
            } else {
              this.common_service.show_sweet_alert('d', 'Error!', "There was some error, Please try again.");
            }
          }
        }, error => {
          this.common_service.show_sweet_alert('d', 'Error!', "There was some error, Please try again.");
        });
      } else {
        this.common_service.show_sweet_alert('i', 'Info!', "New Password & Confirm New Password didnt match. ");
      }
    }
  }

}
