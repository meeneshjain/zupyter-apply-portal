import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";
import { DeviceDetectorService } from 'ngx-device-detector'
/* import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard'; */
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  public common_params = new CommonFunctions();
  public show_loader = false;
  public form_data: any = {};
  public delivery_data: any = {};
  public isMobile = this.deviceService.isMobile();
  public isTablet = this.deviceService.isTablet();
  public isDesktopDevice = this.deviceService.isDesktop();
  public current_step = 1;
  public signature_name: any = '';
  public generated_signature_name: any = '';
  public generated_sign_base64: any = '';
  public attachment1: any = '';
  public attachment2: any = '';
  public attachment3: any = '';
  public lead_id:any = -1;
  public show_success_msg:boolean = false;
  public success_msg: any = '';
  
  public legal_drop_down_list: any = [
    { "key": "LLC", "value": "LLC" },
    { "key": "S-Corporation", "value": "S-Corporation" },
    { "key": "C-Corporation", "value": "C-Corporation" },
    { "key": "Non Profit", "value": "Non Profit" },
    { "key": "Partnership", "value": "Partnership" },
    { "key": "Sole Proprietorship", "value": "Sole Proprietorship" },
    { "key": "Other", "value": "Other" },
  ];

  public premises_leased_list: any = [
    { "key": "N", "value": "No" },
    { "key": "Y", "value": "Yes" },
  ];

  public step_list: any = [
    { "id": "1", "key": "Step 1", "value": "Company / Business Info", "active": true },
    { "id": "2", "key": "Step 2", "value": "Signature Legal Terms", "active": false },
    { "id": "3", "key": "Step 3", "value": "Upload Documents", "active": false },
  ]

  public login_logo = '';
  @ViewChild('signaturePad', { static: false }) signaturePad;

  width: number = 285;
  height: number = 105;
  public options: any = {
    backgroundColor: "rgb(255, 255, 255)",
    fillColor: "rgb(255, 255, 255)",
    penColor: "rgb(0, 0, 0)"
  }

  @ViewChild("placesRef") placesRef: GooglePlaceDirective;

  public handleAddressChange(address) {
    // Do some stuff
    console.log('address ', address)

  }

  public handleBusinessChange(address) {
    // Do some stuff
    console.log('address ', address)
    this.form_data = address;
    this.form_data.Hours = '';
    this.form_data.BusinessName = address.name
    console.log();
    let street_no = '';
    let route = '';
    let subpremise = '';
    this.form_data.EntityType = '';
    this.form_data.IsPremisesLeased = ('N').toString();
    var d = new Date();
    this.form_data.SignatureDate1 = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
    this.form_data.SignatureDate2 = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
    this.form_data.Approve1 = false;
    this.form_data.Apprv1Date = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
    this.form_data.Approve2 = false;
    this.form_data.Apprv2Date = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
    
    this.form_data.Rating = address.rating;
    this.form_data.RatingTotal = address.user_ratings_total;
    this.form_data.Vicinity = address.vicinity;
    this.form_data.MapUrl = address.url;
    this.form_data.PlaceId = address.place_id;
    
    for (let component of address.address_components) {

      if (component['types'].indexOf("street_number") !== -1) {
        street_no = component['short_name']
      }

      if (component['types'].indexOf('route') !== -1) {
        route = component['short_name']
      }

      if (component['types'].indexOf('subpremise') !== -1) {
        subpremise = component['short_name']
      }

      if (component['types'].indexOf('administrative_area_level_1') !== -1) {
        this.form_data.ship_to_address_State = component['short_name']
        this.form_data.bill_to_address_State = component['short_name']

      }

      if (component['types'].indexOf('country') !== -1) {
        this.form_data.ship_to_address_Country = component['short_name']
        this.form_data.bill_to_address_Country = component['short_name']
      }

      if (component['types'].indexOf('locality') !== -1) {
        this.form_data.ship_to_address_City = component['short_name']
        this.form_data.bill_to_address_City = component['short_name']
      }

      if (component['types'].indexOf('postal_code') !== -1) {
        this.form_data.ship_to_address_ZipCode = component['short_name']
        this.form_data.bill_to_address_ZipCode = component['short_name']
      }
    }

    this.form_data.ship_to_address = street_no + ' ' + route + ' ' + subpremise;
    this.form_data.bill_to_address = street_no + ' ' + route + ' ' + subpremise;

    this.form_data.businessphone = this.form_data.formatted_phone_number;

  }

  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
    public shared_service: SharedService,
    private deviceService: DeviceDetectorService,
    // private ngWizardService: NgWizardService
  ) {
    this.delivery_data.Items = [];
    if (sessionStorage.module_list == undefined) {
      this.go_to_dashboard()
    }
  }

  ngOnInit() {
   

    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();

    this.login_logo = this.common_params.default_login_image
    if (sessionStorage.general_setting != undefined) {
      let general = JSON.parse(sessionStorage.general_setting);
      if (general != undefined) {
        this.login_logo = general.LoginScrLogo;
      }
    }
    
    this.lead_id = this.ActivatedRoute.snapshot.paramMap.get('resume_id');
    console.log('this.lead_id ', this.lead_id )
    if (this.lead_id != null) {
      this.show_loader = true;
      this.service.get_application(this.lead_id, '', '', '').subscribe(res => {
        if (res['data'] != undefined && res['data'].length > 0) {
          console.log('res[data] ', res['data'][0]);
          
          this.form_data.Hours = res['data'][0]['Hours']     
          this.form_data.BusinessName = res['data'][0]['BusinessName']
          this.form_data.LegalName = res['data'][0]['LegalName']
          this.form_data.EntityType = res['data'][0]['EntityType'].toString();
          this.form_data.IsPremisesLeased = (res['data'][0]['IsPremisesLeased'] == 'Y') ? 'Y' : 'N';
          this.form_data.LandloadName = res['data'][0]['LandloadName']
          this.form_data.ship_to_address = res['data'][0]['ShipToAddress']
          this.form_data.ship_to_address_City = res['data'][0]['ShipToCity']
          this.form_data.ship_to_address_State = res['data'][0]['ShipToState']
          this.form_data.ship_to_address_ZipCode = res['data'][0]['ShipToZip']
          this.form_data.ship_to_address_Country = res['data'][0]['ShipToCountry']
          this.form_data.email = res['data'][0]['Email']
          this.form_data.businessphone = res['data'][0]['Phone']
          this.form_data.bill_to_address = res['data'][0]['BillToAddress']
          this.form_data.bill_to_address_City = res['data'][0]['BillToCity']
          this.form_data.bill_to_address_State = res['data'][0]['BillToState']
          this.form_data.bill_to_address_ZipCode = res['data'][0]['BillToZip']
          this.form_data.bill_to_address_Country = res['data'][0]['BillToCountry']
          this.form_data.website = res['data'][0]['Website']
          this.form_data.business_status = res['data'][0]['BusinessStatus']
          
          this.form_data.vicinity = res['data'][0]['Location']
          
          this.form_data.UploadedForm = res['data'][0]['UploadedForm']
          this.form_data.SalesTaxPermit = res['data'][0]['SalesTaxPermit']
          this.form_data.ExecutedDocuments = res['data'][0]['ExecutedDocuments']
          
          this.form_data.Approve1 = res['data'][0]['Approve1']
          this.form_data.Apprv1Date = res['data'][0]['Apprv1Date']
          this.form_data.Approve2 = res['data'][0]['Approve2']
          this.form_data.Apprv2Date = res['data'][0]['Apprv2Date']
          
          this.form_data.Contacts = res['data'][0]['Contacts']
          this.form_data.Rating = res['data'][0]['rating'];
          this.form_data.RatingTotal = res['data'][0]['user_ratings_total'];
          this.form_data.Vicinity = res['data'][0]['vicinity'];
          this.form_data.MapUrl = res['data'][0]['url'];
          this.form_data.PlaceId = res['data'][0]['place_id'];
          
          if (this.form_data.Contacts.length > 0 ){
            var d = new Date();
            let contact0 = (this.form_data.Contacts[0]!= undefined) ? this.form_data.Contacts[0] : {};
            let contact1 = (this.form_data.Contacts[1]!= undefined) ? this.form_data.Contacts[1] : {};
            
            this.form_data.nameCorpOfficer1 = (contact0["CorpOfficer"]!= undefined) ? contact0["CorpOfficer"] : '';
            this.form_data.telephone1 = (contact0["Tel"]!= undefined) ? contact0["Tel"] : '';
            this.form_data.SSNo1 = (contact0["SSNo"]!= undefined) ? contact0["SSNo"] : '';
            this.form_data.fax1 = (contact0["Fax"]!= undefined) ? contact0["Fax"] : '';
            this.form_data.signature_name1 = (contact0["PrintedName"]!= undefined) ? contact0["PrintedName"] : '';
            this.generate_customer_sign(1)
            // this.form_data.generated_sign_base64_1 = (contact0["Signature"] != undefined) ? contact0["Signature"] : '';
            
            this.form_data.title1 = (contact0["Title"]!= undefined) ? contact0["Title"] : '';
            this.form_data.Email1 = (contact0["Email"]!= undefined) ? contact0["Email"] : '';
            this.form_data.SignatureDate1 = (contact0  != undefined && contact0['SignatureDate']!= '') ? contact0['SignatureDate'] : (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
            
            
            this.form_data.nameCorpOfficer2 = (contact1["CorpOfficer"]!= undefined) ? contact1["CorpOfficer"] : '';
            this.form_data.telephone2 = (contact1["Tel"]!= undefined) ? contact1["Tel"] : '';
            this.form_data.SSNo2 = (contact1["SSNo"]!= undefined) ? contact1["SSNo"] : '';
            this.form_data.fax2 = (contact1["Fax"]!= undefined) ? contact1["Fax"] : '';
            this.form_data.signature_name2 = (contact1["PrintedName"]!= undefined) ? contact1["PrintedName"] : '';
            this.generate_customer_sign(2)
            // this.form_data.generated_sign_base64_2 = (contact1["Signature"]!= undefined) ? contact1["Signature"] : '';
            
            this.form_data.title2 = (contact1["Title"]!= undefined) ? contact1["Title"] : '';
            this.form_data.Email2 = (contact1["Email"]!= undefined) ? contact1["Email"] : '';
            this.form_data.SignatureDate2 = (contact1 != undefined && contact1['SignatureDate'] != '') ? contact1['SignatureDate'] : (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
            
        
          }
          
          setTimeout(() => {
            this.show_loader = false;
          }, 5000);
        } else {
          this.show_loader = false;
          this.common_service.show_sweet_alert('e', "Error!", 'No application found');
        }

      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", this.common_service.error_message);
      });


    } else {
      this.show_loader = true;
      setTimeout(() => {
        this.show_loader = false;
      }, 200);
      this.lead_id = -1;
      this.form_data.EntityType = '';
      var d = new Date();
      this.form_data.Hours = '';
      this.form_data.SignatureDate1 = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
      this.form_data.SignatureDate2 = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
      this.form_data.IsPremisesLeased = 'N';
      this.form_data.ship_to_address = '';
      this.form_data.bill_to_address = '';
  
      this.form_data.Approve1 = false;
      this.form_data.Apprv1Date = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
      this.form_data.Approve2 = false;
      this.form_data.Apprv2Date = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
    }
  }
 

  handleUpload(type, event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      if (type == 1) {
        this.form_data.SalesTaxPermit = reader.result
      }

      if (type == 2) {
        this.form_data.ExecutedDocuments = reader.result
      }

      /*   if (type == 3) {
          this.attachment3 = reader.result
        } */

      if (type == 4) {
        this.form_data.UploadedForm = reader.result
      }

    };
  }

  isEmpty() {
    console.log('is empty', this.signaturePad.isEmpty());
  }

  savePng() {
    const data = this.signaturePad.toDataURL();
    console.log(data);
  }

  saveJpg() {
    const data = this.signaturePad.toDataURL("image/jpeg");
    console.log(data);
  }

  saveSvg() {
    const data = this.signaturePad.toDataURL("image/svg+xml");
    console.log(data);
  }

  saveArray() {
    const data = this.signaturePad.toData();
    console.log(data);
    console.log(JSON.stringify(data));
  }

  clear() {
    console.log('clear');
    if (this.signaturePad != undefined) this.signaturePad.clear();

    this.generated_signature_name = '';
    this.signature_name = '';
  }

  onSubmit(isValid: Boolean, type) {
    console.log('isValid ', isValid)
    if (isValid) {
      this.show_loader = true;
      let dataset = JSON.parse(JSON.stringify(this.form_data));
      let mode = 'A';
      let msg = "Your Application has been saved";
      if (this.lead_id!= -1){
        mode = 'M';
        msg = "Your Application has been updated";
      }
      this.service.add_application(mode, this.lead_id, dataset).subscribe(res => {
        if (res['data']!= undefined && res['data'].length > 0){
          if (res['data'][0]['Message'] == true || res['data'][0]['Message'] == 'True' || res['data'][0]['Message'] == 'true') {
            setTimeout(() => {
              this.show_loader = false;
            }, 1000);
            this.lead_id = res['data'][0]['Lead_Id'];
            this.show_success_msg = true;
            this.success_msg = msg
            setTimeout(() => {
              this.show_success_msg = false;
            }, 4000);
            
            if (type == 1) {
              
             // this.common_service.show_sweet_alert('s', msg, "");
              this.go_to_step(2);
            } else if (type == 2) {
             // this.common_service.show_sweet_alert('s', msg, "");
              this.go_to_step(3);
            } else if (type == 3) {

            } else if (type == 4) {
              this.common_service.show_sweet_alert('s', "Application submitted successfully", "");
              this.go_to_dashboard()
            }
          } else {
            this.show_loader = false;
            this.common_service.show_sweet_alert('e', "Error!", this.common_service.error_message);
          }  
        } else {
          this.show_loader = false;
          this.common_service.show_sweet_alert('e', "Error!", this.common_service.error_message);
        }
        
      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", this.common_service.error_message);
      });
    }
  }

  go_to_dashboard() {
    this.common_service.change_route('/get-started')
  }

  go_to_step(step) {
    this.current_step = step;
    for (let index in this.step_list) {

      if (this.step_list[index]['id'] == step) {
        this.step_list[index]['active'] = true;
      } else {
        this.step_list[index]['active'] = false;
      }
    }

  }

  generate_customer_sign(type) {
    if (type == 1) {
      this.form_data.generated_signature_name1 = this.form_data.signature_name1;
    }

    if (type == 2) {
      this.form_data.generated_signature_name2 = this.form_data.signature_name2;
    }

    var node: any = '';
    if (type == 1) {
      node = document.getElementById('generated_signature_id1');
    }

    if (type == 2) {
      node = document.getElementById('generated_signature_id2');
    }
    
    setTimeout(() => {
      htmlToImage.toJpeg(node, { quality: 0.80 }).then((dataUrl) => {
        if (type == 1) {
          this.form_data.generated_sign_base64_1 = dataUrl;
        }

        if (type == 2) {
          this.form_data.generated_sign_base64_2 = dataUrl;
        }
        
      })
        .catch((error) => {
          console.error('oops, something went wrong!', error);
        });
    }, 250);


  }

  remove() {

  }

}
