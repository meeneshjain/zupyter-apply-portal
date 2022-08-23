import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public common_params = new CommonFunctions();
  public show_loader = false;
  public form_data: any = {};
  public transaction_details = [];
  public selected_transaction = {};
  
  public isMobile = this.deviceService.isMobile();
  public isTablet = this.deviceService.isTablet();
  public isDesktopDevice = this.deviceService.isDesktop();
  
  
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
    public shared_service: SharedService,
    private deviceService: DeviceDetectorService
  ) { }

  ngOnInit() {
    this.common_service.check_session_on();
    this.show_loader = true;
    this.get_delivery_app_data()
  }
  
  get_delivery_app_data() {
    this.service.get_delivery_app_data(-1).subscribe((res) => {
      console.log('res ', res)
      if (res != null) {
        if (res.data != undefined && res.data.length > 0) {
          this.transaction_details = res.data;
          for(let index in this.transaction_details){
            this.transaction_details[index]['ArrivalTime'] = this.transaction_details[index]['ArrivalTime'].replace(/(..)/g, '$1:').slice(0, -1)
            this.transaction_details[index]['DeliveryStartTime'] = this.transaction_details[index]['DeliveryStartTime'].replace(/(..)/g, '$1:').slice(0, -1)
            this.transaction_details[index]['DeliveryEndTime'] = this.transaction_details[index]['DeliveryEndTime'].replace(/(..)/g, '$1:').slice(0, -1)
            this.transaction_details[index].delivery_status = this.common_service.get_delivery_status(this.transaction_details[index]['DeliveryStatus'], 'value');
            this.transaction_details[index].delivery_badge_color = this.common_service.get_delivery_status(this.transaction_details[index]['DeliveryStatus'], 'class');
            
            this.transaction_details[index].total_packages = 0;
            this.transaction_details[index].GrossWeight = 0;
            this.transaction_details[index].CheckNo = '';
            this.transaction_details[index].PaymentMethod = (this.transaction_details[index].PaymentMethod == 'CH') ? this.transaction_details[index].PaymentMethod : 'CA';
            var d = new Date();
            this.transaction_details[index].SignatureDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
            if (this.transaction_details[index].Items.length > 0) {
              for (let i in this.transaction_details[index].Items) {
                this.transaction_details[index].total_packages = this.transaction_details[index].total_packages + this.transaction_details[index].Items[i]['Quantity']
                this.transaction_details[index].GrossWeight = this.transaction_details[index].GrossWeight + parseInt(this.transaction_details[index].Items[i]['Weight1'])
              }
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
  
  show_transaction_details(activitydetailpopup , row_data){
    this.selected_transaction = row_data
    console.log('row_data ', row_data )
    this.common_service.openModal(activitydetailpopup, 'modal-lg')
  }
  
  close_transaction(){
    this.common_service.closeModal('') 
    setTimeout(() => {
      this.selected_transaction = {};
    }, 10);
  }
  
  view_details(row_data){
    this.common_service.change_route('delivery/delivery-detail/' + row_data.DocEntry)
  }

}