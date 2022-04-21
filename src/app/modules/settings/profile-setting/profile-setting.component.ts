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
  public module_id = 0;
  public email_address = "";
 public fullname = '';
 public country_list = [];
  public method: string;
  public user_detail 
 
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
    this.service.get_contry_list((res)=>{
       this.country_list = res.data;
    })
    this.method = 'A';
    this.form_data.PayType = 'CC';
    this.form_data.CustomerType = 'Individual';
    this.form_data.PayProfileID = -1;
    this.form_data.Custid = -1;
    this.form_data.customerProfileId = '';
    this.form_data.CardType = '';
    this.form_data.Fax = '';
    this.form_data.customerPaymentProfileId = '';
    this.form_data.Active = ('true').toString();
    this.form_data.DefltPayProfile = ('false').toString();
    this.form_data.Country = ('United States').toString();
    this.get_profile(); 
  }
  
  get_profile(){
    let userd = JSON.parse(sessionStorage.user_details);
    if (userd['CardCode'] != null && userd['CardCode']!= ""){
      
      this.show_loader = true;
      this.service.get_payment_profile(userd['CardCode']).subscribe((res) => {
        this.show_loader = false;
        console.log('res ', res )
        if(res!= null){
          if (res.data!= undefined ){
            this.form_data = res.data[0];
            // this.form_data.Card 
            console.log('this.form_data ', this.form_data )
          } 
        } else {
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
  
  onPaymentSubmit(isValid: Boolean) {
    console.log('isValid ', isValid)
    console.log('this.form_data ', this.form_data);

    if (isValid) {
      let dataset = JSON.parse(JSON.stringify(this.form_data));
      if (dataset.PayType == 'CC'){
        dataset.ACName = '';
        dataset.ACTypeID = '';
        dataset.ACTypeName = '';
        dataset.ACABRouteNo = '';
        dataset.ACNumber = '';
        dataset.ACBank = '';
      } else {
        dataset.CardType = '';
        dataset.CardNumber = '';
        dataset.CardExpiry = '';
        dataset.CVV = '';
      }
      
      
      this.show_loader = true;
      this.service.create_payment_profile(this.method, dataset).subscribe(response => {
        console.log('response ', response );
        if (response!= null){
          if(response!= undefined){
            if (response.Errors.length > 0){
              this.common_service.show_sweet_alert('e', "Errors!", `Error Code - ${response.Errors[0]['errorcode']} ${response.Errors[0]['errordesc']} ` );
              this.show_loader = false;
              this.common_service.closeModal('');              
            }
          } else {
            this.show_loader = false;
            this.common_service.show_sweet_alert('e', "Error!", "There was some error, Please try again.");
          }
        } else {
          this.show_loader = false;
          this.common_service.show_sweet_alert('e', "Error!", "There was some error, Please try again.");  
        }

      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", "There was some error, Please try again.");
      });
    }
  }
  
  change_pay_typ(value){
    this.form_data.PayType = value; 
  }
  
  onSubmit(isValid: Boolean) {
    console.log('isValid ', isValid)
    if (isValid) {
    }
  }


}
