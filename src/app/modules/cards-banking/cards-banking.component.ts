import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";

@Component({
  selector: 'app-cards-banking',
  templateUrl: './cards-banking.component.html',
  styleUrls: ['./cards-banking.component.scss']
})
export class CardsBankingComponent implements OnInit {
  public common_params = new CommonFunctions();
  public show_loader = false;
  public card_form_data: any = {};
  public bank_form_data: any = {};
  public paymentProfileData: any = [];
  public card_list = [];
  public bank_account_list = [];
  public method: string;
  public default_payment_profile = [];
  public Custid: string = '';;
  public customerProfileId: string = '';
  public current_bank = {};
  public current_card = {};
  public bank_form_title = '';
  public bank_button_title = '';

  public card_form_title = '';
  public card_button_title = '';

  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
  ) { }


  ngOnInit(): void {
    this.show_loader = true;
    this.get_profile()
  }

  get_profile() {
    this.card_list = [];
    this.bank_account_list = [];
    let userd = JSON.parse(sessionStorage.user_details);
    if (userd['CardCode'] != null && userd['CardCode'] != "") {
      this.show_loader = true;
      this.service.get_payment_profile(userd['CardCode']).subscribe((res) => {
        this.show_loader = false;
        if (res != null) {
          if (res.data != undefined) {
            this.paymentProfileData = res.data[0];
            this.Custid = this.paymentProfileData.Custid
            this.customerProfileId = this.paymentProfileData.customerProfileId
            this.default_payment_profile = JSON.parse(JSON.stringify(this.paymentProfileData.PayProfiles[0]));

            for (let profile of this.paymentProfileData.PayProfiles) {
              if (profile.PayType == 'BA') {
                this.bank_account_list.push(profile);
              } else {
                this.card_list.push(profile);
              }
            }
          }
        }
      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "", this.common_service.error_message);
      });
    } else {
      this.common_service.show_sweet_alert('e', "", "Card Code not found, please try again ");
      this.show_loader = false;

    } 
  }

  account_type_change(value) {
    if (value == 'saving') {
      this.bank_form_data.ACTypeID = 1;
    }

    if (value == 'checking') {
      this.bank_form_data.ACTypeID = 0;
    }

    if (value == 'business_checking') {
      this.bank_form_data.ACTypeID = 2;
    }
  }

  clear_fields(type, form_data) {
    form_data.Custid = this.Custid
    form_data.customerProfileId = this.customerProfileId
    form_data.ACName = '';
    form_data.customerPaymentProfileId = '';
    form_data.ACTypeID = -1;
    form_data.ACTypeName = '';
    form_data.ACABRouteNo = '';
    form_data.ACNumber = '';
    form_data.ACBank = '';

    form_data.CardType = '';
    form_data.CardNumber = '';
    form_data.CardExpiry = '';
    form_data.CVV = '';

    form_data.City = '';
    form_data.Company = '';
    form_data.Address = '';
    form_data.Country = '';
    form_data.CustomerType = 'Individual';
    form_data.DefltPayProfile = false;
    form_data.Fax = '';
    form_data.FirstName = '';
    form_data.LastName = '';
    form_data.PayProfileID = -1;

    form_data.Phone = '';
    form_data.State = '';
    form_data.Zip = '';
    form_data.PayType = type;
    if (type == 'CC') {

      this.card_form_data = form_data
    } else if (type == 'BA') {

      this.bank_form_data = form_data;
    }
  }

  generate_address(type) {
    let billto = this.paymentProfileData.Addresses.filter(obj => {
      return obj.AdresType == 'B'
    });

    if (type == 'CC') {
      this.card_form_data.bill_to_address = billto[0]
      this.card_form_data.Address = billto[0]['Street'] + '' + billto[0]['StreetNo'] + ' ' + billto[0]['Block'] + " " + billto[0]['City'] + " " + billto[0]['ZipCode'] + ", " + billto[0]['State'] + ", " + billto[0]['Country'];
      this.card_form_data.City = billto[0]['City'];
      this.card_form_data.State = billto[0]['State'];
      this.card_form_data.Zip = billto[0]['ZipCode'];
      this.card_form_data.Country = billto[0]['Country'];
    } else if (type == 'BA') {
      this.bank_form_data.bill_to_address = billto[0]
      this.bank_form_data.Address = billto[0]['Street'] + '' + billto[0]['StreetNo'] + ' ' + billto[0]['Block'] + " " + billto[0]['City'] + " " + billto[0]['ZipCode'] + ", " + billto[0]['State'] + ", " + billto[0]['Country'];
      this.bank_form_data.City = billto[0]['City'];
      this.bank_form_data.State = billto[0]['State'];
      this.bank_form_data.Zip = billto[0]['ZipCode'];
      this.bank_form_data.Country = billto[0]['Country'];
    }


  }

  addCard(add_card_popup) {
    this.card_form_data = this.default_payment_profile;
    this.clear_fields('CC', this.card_form_data)
    this.method = 'A';
    this.card_form_title = 'Add a Card';
    this.card_button_title = "Save Card";
    this.common_service.openModal(add_card_popup, 'modal-md')
  }

  editCard(add_card_popup, profile) {
    this.card_form_data = profile;
    this.card_form_data.CardHoldername = profile.FirstName + ' ' + profile.LastName;
    console.log('this.card_form_data ', this.card_form_data)
    this.method = 'M';
    this.card_form_title = 'Edit Card';
    this.card_button_title = "Update Card";
    this.common_service.openModal(add_card_popup, 'modal-md')
  }

  addBank(addBankPopup) {
    this.bank_form_data = this.default_payment_profile;
    this.method = 'A';
    this.clear_fields('BA', this.bank_form_data)
    this.bank_form_title = 'Add bank account';
    this.bank_button_title = "Save Bank Account";
    this.common_service.openModal(addBankPopup, 'modal-lg')
  }

  editBank(addBankPopup, profile) {
    this.bank_form_data = profile;
    this.method = 'M';
    this.bank_form_title = 'Edit bank account';
    this.bank_button_title = "Update Bank Account";
    this.common_service.openModal(addBankPopup, 'modal-lg')
  }

  view_bank_details(viewBankPopup, profile) {
    this.current_bank = profile;
    console.log('this.profile ', profile )
    this.common_service.openModal(viewBankPopup, 'modal-md')
  }

  onBankSubmit(isValid: Boolean) {
    console.log('isValid ', isValid)
    console.log('this.form_data ', this.bank_form_data);
    this.generate_address('BA');
    let dataset = JSON.parse(JSON.stringify(this.bank_form_data));
    dataset.customerProfileId = this.customerProfileId
    if (isValid) {
      this.show_loader = true;
      this.service.create_payment_profile(this.method, dataset, dataset).subscribe(response => {
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
          this.common_service.show_sweet_alert('s', "Success!", 'Bank Account Saved Successfully');
          this.get_profile()
          this.common_service.closeModal('');
        }



      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", "There was some error, Please try again.");
      });

    }
  }

  OnCardSubmit(isValid: Boolean) {
    console.log('isValid ', isValid)
    console.log('this.form_data ', this.card_form_data);
    this.generate_address('CC');
    let dataset = JSON.parse(JSON.stringify(this.card_form_data));
    if (isValid) {
      this.show_loader = true;
      dataset.CVV = parseInt(dataset.CVV);
      dataset.CardExpiry = parseInt(dataset.CardExpiry);
      dataset.CardNumber = parseInt(dataset.CardNumber);
      let CardHoldername = dataset.CardHoldername.split(" ")
      dataset.customerProfileId = this.customerProfileId
      dataset.FirstName = CardHoldername[0];
      dataset.LastName = (CardHoldername[1] != undefined) ? CardHoldername[1] : ''
      this.service.create_payment_profile(this.method, dataset, dataset).subscribe(response => {
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
          this.get_profile()
          this.common_service.show_sweet_alert('s', "Success!", 'Credit Card Saved Successfully');
          this.common_service.closeModal('');
        }

      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", "There was some error, Please try again.");
      });

    }
  }

  delete_payment_profile(profile) {
    console.log('profile ', profile)
    this.common_service.show_sweet_confirm_box("You sure about that ?", "You want to delete this Payment Profile?", () => {
      this.show_loader = true;
      this.service.delete_payment_profile(this.customerProfileId, profile.PayProfileID, profile.customerPaymentProfileId).subscribe(response => {
        this.show_loader = false;
        if (response.Message == 'true' || response.Message == 'True') {
          this.get_profile()
          this.common_service.show_sweet_alert('s', "Success!", "Payment Profile Deleted Successfully.");
          this.common_service.closeModal('');

        } else {
          this.common_service.show_sweet_alert('e', "Error!", "There was some error, Please try again.");
        }
      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", "There was some error, Please try again.");
      });
    }, "")
  }

}
