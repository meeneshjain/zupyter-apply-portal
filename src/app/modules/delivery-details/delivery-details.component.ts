import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss']
})
export class DeliveryDetailsComponent implements OnInit {
  
  public common_params = new CommonFunctions();
  public show_loader = false;
  public form_data: any = {};
  public delivery_data:any = {};
  public selected_transaction = {};
  public DocEntry = '';
  public search_string:any = '';
  public isMobile = this.deviceService.isMobile();
  public isTablet = this.deviceService.isTablet();
  public isDesktopDevice = this.deviceService.isDesktop();
  public fleet_settings:any = {};
  @ViewChild('signaturePad', { static: false }) signaturePad;
  
  width: number = 410;
  height: number = 70;
  options: any = null;
  
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
    public shared_service: SharedService,
    private deviceService: DeviceDetectorService
  ) {
    this.delivery_data.Items = [];
   }


  ngOnInit() {
    this.common_service.check_session_on();
    this.show_loader = true;
    this.show_loader = false;
    this.DocEntry = this.ActivatedRoute.snapshot.paramMap.get('one');
    this.delivery_data.Items = [];
    this.fleet_settings = {};
    this.get_fleet_settings();
    if (this.DocEntry != null) {
      this.show_loader = true;
      this.get_delivery_app_data(this.DocEntry);
    }
  }
  
  get_fleet_settings(){
    this.show_loader = true;
    this.service.get_fleet_settings().subscribe((res) => {
      if (res != null) {
        if (res.data != undefined && res.data.length > 0) {
          this.fleet_settings = res.data[0];
        }
      }
      this.show_loader = false;
    }, error => {
      this.show_loader = false;
      this.common_service.show_sweet_alert('e', "", this.common_service.error_message);
    });
  }
  
  get_delivery_app_data(DocEntry) {
    this.service.get_delivery_app_data(DocEntry).subscribe((res) => {
      console.log('res ', res)
      if (res != null) {
        if (res.data != undefined && res.data.length > 0) {
          this.delivery_data = res.data[0];
          this.delivery_data.ArrivalTime = this.delivery_data.ArrivalTime.replace(/(..)/g, '$1:').slice(0, -1)
          this.delivery_data.DeliveryStartTime = this.delivery_data.DeliveryStartTime.replace(/(..)/g, '$1:').slice(0, -1)
          this.delivery_data.DeliveryEndTime = this.delivery_data.DeliveryEndTime.replace(/(..)/g, '$1:').slice(0, -1)
          this.delivery_data.delivery_status = this.common_service.get_delivery_status(this.delivery_data['DeliveryStatus'], 'value');
          this.delivery_data.delivery_badge_color = this.common_service.get_delivery_status(this.delivery_data['DeliveryStatus'], 'class');
          this.delivery_data.total_packages = 0;
          this.delivery_data.GrossWeight = 0;
          this.delivery_data.CheckNo ='';
          this.delivery_data.PaymentMethod = (this.delivery_data.PaymentMethod == 'CH') ? this.delivery_data.PaymentMethod : 'CA';
          var d = new Date();
          this.delivery_data.SignatureDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
          if (this.delivery_data.Items.length > 0){
            for (let i in this.delivery_data.Items){
              this.delivery_data.total_packages = this.delivery_data.total_packages + this.delivery_data.Items[i]['Quantity']
              this.delivery_data.GrossWeight = this.delivery_data.GrossWeight + parseInt(this.delivery_data.Items[i]['Weight1'])
            }
          }
        }
      }
      this.show_loader = false;
    }, error => {
      this.show_loader = false;
      this.common_service.show_sweet_alert('e', "", this.common_service.error_message);
    });
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
    this.signaturePad.clear();
  }

  changeOptions() {
    console.log('options changed');
    this.options = {
      minWidth: 5,
      maxWidth: 10,
      penColor: "rgb(66, 133, 244)"
    };
  }

 /*  setSigArray() {
    let jsonString = '[{"color":"rgb(66, 133, 244)","points":[{"time":1582940095394,"x":267,"y":116}]},{"color":"rgb(66, 133, 244)","points":[{"time":1582940096537,"x":297,"y":115}]},{"color":"rgb(66, 133, 244)","points":[{"time":1582940097774,"x":239,"y":135},{"time":1582940097853,"x":240,"y":141},{"time":1582940097885,"x":242,"y":148},{"time":1582940097918,"x":244,"y":153},{"time":1582940097983,"x":248,"y":158},{"time":1582940098033,"x":252,"y":162},{"time":1582940098064,"x":257,"y":165},{"time":1582940098112,"x":264,"y":167},{"time":1582940098144,"x":271,"y":167},{"time":1582940098177,"x":284,"y":168},{"time":1582940098210,"x":295,"y":168},{"time":1582940098244,"x":302,"y":165},{"time":1582940098277,"x":309,"y":161},{"time":1582940098311,"x":315,"y":156},{"time":1582940098343,"x":322,"y":148},{"time":1582940098376,"x":325,"y":142},{"time":1582940098392,"x":330,"y":136},{"time":1582940098442,"x":333,"y":131}]}]';
    this.signaturePad.fromData(JSON.parse(jsonString));
  }

  //
  setSigString() {
    this.signaturePad.fromDataURL("data:image/png;base64,iVBORw...");
  } */
  
  onSubmit(isValid: Boolean) {
    var signature = '';
    if (!this.signaturePad.isEmpty()){
      signature = this.signaturePad.toDataURL(); 
      signature = signature.replace("data:image/png;base64,", '')
      console.log("signature - ", signature);
      let dataset = JSON.parse(JSON.stringify(this.delivery_data));
      console.log('this.fleet_settings ', this.fleet_settings )
      this.service.update_delivery(this.fleet_settings, dataset, signature).subscribe(response => {
        console.log('response ', response);
        if (response.Message != ''){
          if (response.Message == 'true' || response.Message == 'True'){
            this.show_loader = false;
            this.common_service.show_sweet_alert('s', "Success!", 'Updated Succesfully');  
          } else {
            
            this.show_loader = false;
            this.common_service.show_sweet_alert('e', "Error!", response.Message);  
          }
        } 
      }, error => {
        this.show_loader = false;
        this.common_service.show_sweet_alert('e', "Error!", "There was some error, Please try again.");
      });
      
    } else {
      this.common_service.show_sweet_alert('e', "Errors!", `Please sign the form before you submit`);
    }
  }
  
  go_to_dashboard() {
    this.common_service.change_route('/dashboard')
  }
  

  change_pay_typ(value) {
    this.delivery_data.PaymentMethod = value;
    if (value == 'Cash'){
      this.delivery_data.CheckNo = '';
    }
    
  }
  
  term_condition(){
    this.common_service.show_sweet_alert('', "", `The perishable agricultural commodities listed on this invoice are sold subject to the statutory trust authorized by section 5(c) of the Perishable Agricultural Commodities Act, 1930(7 U.S.C. 499e(c)).The seller of these commodities retains a trust claim over these commodities, all inventories of food or other products derived from these commodities, and any receivables or proceeds from the sale of these commodities until full payment is received.`);  
  }

}
