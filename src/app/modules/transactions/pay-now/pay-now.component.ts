import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";


@Component({
  selector: 'app-pay-now',
  templateUrl: './pay-now.component.html',
  styleUrls: ['./pay-now.component.scss']
})
export class PayNowComponent implements OnInit {

  public common_params = new CommonFunctions();
  public show_loader = false;
  public show_profile_loader = false;
  public form_data: any = {};
  public checkall = true
  public total_inv_amt = 0;
  public total_fees = 0;
  public total_payment_amt = 0;
  public card_list = [];
  public bank_account_list = [];
  public Custid: string = '';;
  public customerProfileId: string = '';;
  public customerPaymentProfileId: string = '';;
  public paymentProfileData: any = [];
  public d = new Date();
  public current_date = (this.d.getMonth() + 1) + '/' + this.d.getDate() + '/' + this.d.getFullYear()
  public inv_number = '';
  public agree_term_condition = false;
  public payProfileID = '';
  public company_name = '';
  
  public card_form_data:any = {};
  public bank_form_data:any = {};
  public default_payment_profile = [];

  
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService
  ) {
    this.form_data['transaction_items'] = [];
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
  
  account_type_change(value) {
    if (value == 'saving') {
      this.bank_form_data['ACTypeID'] = 1;
    }

    if (value == 'checking') {
      this.bank_form_data['ACTypeID'] = 0;
    }

    if (value == 'business_checking') {
      this.bank_form_data['ACTypeID'] = 2;
    }
  }
  
  generate_address(type) {
    let billto = this.paymentProfileData.Addresses.filter(obj => {
      return obj.AdresType == 'B'
    });

    if (type == 'CC') {
      this.card_form_data['bill_to_address'] = billto[0]
      this.card_form_data['Address'] = billto[0]['Street'] + '' + billto[0]['StreetNo'] + ' ' + billto[0]['Block'] + " " + billto[0]['City'] + " " + billto[0]['ZipCode'] + ", " + billto[0]['State'] + ", " + billto[0]['Country'];
      this.card_form_data['City'] = billto[0]['City'];
      this.card_form_data['State'] = billto[0]['State'];
      this.card_form_data['Zip'] = billto[0]['ZipCode'];
      this.card_form_data['Country'] = billto[0]['Country'];
    } else if (type == 'BA') {
      this.bank_form_data['bill_to_address'] = billto[0]
      this.bank_form_data['Address'] = billto[0]['Street'] + '' + billto[0]['StreetNo'] + ' ' + billto[0]['Block'] + " " + billto[0]['City'] + " " + billto[0]['ZipCode'] + ", " + billto[0]['State'] + ", " + billto[0]['Country'];
      this.bank_form_data['City'] = billto[0]['City'];
      this.bank_form_data['State'] = billto[0]['State'];
      this.bank_form_data['Zip'] = billto[0]['ZipCode'];
      this.bank_form_data['Country'] = billto[0]['Country'];
    }


  }



  ngOnInit() {
    this.common_service.check_session_on();
    this.show_loader = true;
    this.form_data['transaction_items'] = [];
    this.form_data.paymentMode = '';
    this.form_data.selected_card = '';
    this.form_data.selected_bank = '';
    let invoice_list = [];
    if (sessionStorage.transaction_data != undefined && sessionStorage.transaction_data != null) {
      this.form_data.transaction_items = JSON.parse(sessionStorage.transaction_data);
      this.form_data.transaction_items = this.form_data.transaction_items.filter(obj =>{
        obj.docNum = obj.Document.replace("A/R Invoice -  ", ' ').trim()
        obj.checked = true;
        obj.payment_amount = obj.BalanceDue;
        invoice_list.push(obj.docNum) ; 
        return obj;
      })
      
      this.inv_number = invoice_list.join(', ')
      this.company_name = JSON.parse(sessionStorage.general_setting).CompanyName || 'Om Produce';  
    } else {
      this.common_service.show_sweet_alert('w', "!Error", 'No Item Found, Please select atleast one invoice to proceed ');
      this.common_service.change_route('transaction');

    }
    console.log('this.form_data.transaction_items ', this.form_data.transaction_items)
    this.calculate_total_inv();
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

    }
  }
  
  calculate_total_inv(){
    let total_inv = 0;
    for(let item of this.form_data.transaction_items){
      if (item.checked == true){
          total_inv += parseFloat(item.payment_amount)
        
      }
    }
    
    this.total_inv_amt = total_inv;
    this.total_payment_amt = this.total_fees + this.total_inv_amt; 
  }
  
  select_unselect_all() {
    console.log('checkall ', this.checkall)
    this.form_data.transaction_items = this.form_data.transaction_items.filter(obj => {
      obj.checked = this.checkall
      return obj;
    })

    this.check_selected()
    this.calculate_total_inv();
  }
  
  validate_payment_amount(DocEntry, index, payment_amount, BalanceDue){
    let price_v = (payment_amount);
   
    if (isNaN(price_v) || price_v == null || price_v == '') { price_v = 0; }
    let price_v_field: any = (<HTMLInputElement>document.getElementsByClassName("payment_amt_field")[index]);
    
    if (price_v > parseFloat(BalanceDue)){
      price_v = parseFloat(BalanceDue);
    }
    this.form_data.transaction_items[index]['payment_amount'] = price_v
    price_v_field.value = price_v;
    
    this.calculate_total_inv();
  }
  
  check_selected() {
    let filtered_item = this.form_data.transaction_items.filter(obj => {
      if (obj.checked == true) {
        return obj
      };
    })
    
    if (filtered_item.length == this.form_data.transaction_items.length){
      this.checkall = true;
    } else {
      this.checkall = false;
    }

    this.calculate_total_inv();
  }

  check_row_item(DocEntry) {
    this.check_selected()
    this.calculate_total_inv();

  }
  
  go_back() {
    this.common_service.change_route('transaction');

  }
 
  PayNowSubmit(isValid: Boolean) {
    if(isValid){
      console.log('transaction_items ', this.form_data['transaction_items']);
      console.log('this.total_inv_amt ', this.total_inv_amt);
      console.log('this.total_payment_amt ', this.total_payment_amt);
      console.log('agree_term_condition ', this.agree_term_condition )
       let line_data = [];
      let lineId = 0;
      for (let item of this.form_data['transaction_items']){
        line_data.push({
          "pp_TransLineId": -1,
          "LineId": lineId,
            "DocEntry": item.DocEntry,
            "DocNum": item.docNum,
            "ObjType": 13,
            "SumApplied": item.payment_amount,
          "DocLine": lineId,
            "DiscSum": 0
          });
        lineId++;
      }
      this.show_loader = true;
      this.service.add_transaction(this.customerProfileId, this.customerPaymentProfileId, this.payProfileID, this.total_payment_amt, line_data).subscribe((response) => {
        console.log('response ', response )
        this.show_loader = false;
        if (response != null && response.length > 0){
          if (response[0].pp_TransID != undefined && response[0].pp_TransID!= ''){
            this.common_service.change_route('transaction/pay-confirm/' + response[0].pp_TransID);
            
          } else {
            this.common_service.show_sweet_alert('e', "Error!", "Unable to add transaction please try again.");
          }
        } else {
          this.common_service.show_sweet_alert('e', "Error!", "Unable to add transaction please try again.");

        }
      }, error =>{
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "", this.common_service.error_message);
      }); 
    }
  }
  
  on_card_change(add_card_popup){
    if (this.form_data.selected_card != 'add_card'){
      let index = this.card_list.findIndex(obj => {
        return obj.PayProfileID == this.form_data.selected_card
      })
      this.payProfileID = this.form_data.selected_card;
      this.customerPaymentProfileId = this.card_list[index]['customerPaymentProfileId']
    } else {
      this.card_form_data = this.default_payment_profile;
      this.clear_fields('CC', this.card_form_data)
      this.common_service.openModal(add_card_popup, 'modal-md')

    }
  }
  
  on_bank_change(addBankPopup){
    if (this.form_data.selected_bank != 'add_bank') {
      let index = this.bank_account_list.findIndex(obj => {
        return obj.PayProfileID == this.form_data.selected_bank
      })
      this.payProfileID = this.form_data.selected_bank;
      this.customerPaymentProfileId = this.bank_account_list[index]['customerPaymentProfileId']
    } else {
      this.bank_form_data = this.default_payment_profile;
      this.clear_fields('BA', this.bank_form_data)
      this.common_service.openModal(addBankPopup, 'modal-md')
    }
  }
  
  onBankSubmit(isValid: Boolean) {
    console.log('isValid ', isValid)
    console.log('this.form_data ', this.bank_form_data);
    this.generate_address('BA');
    let dataset = JSON.parse(JSON.stringify(this.bank_form_data));
    dataset.customerProfileId = this.customerProfileId
    if (isValid) {
      this.show_loader = true;
      this.service.create_payment_profile('A', dataset, dataset).subscribe(response => {
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
          this.form_data.selected_bank = '';
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
      this.service.create_payment_profile('A', dataset, dataset).subscribe(response => {
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
          this.form_data.selected_card = '';
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
  
}
