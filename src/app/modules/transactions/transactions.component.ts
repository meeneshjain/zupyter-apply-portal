import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, Event, NavigationStart, ActivatedRoute, NavigationEnd, NavigationError } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  public common_params = new CommonFunctions();
  public show_loader = false;
  public submit_show_loader = false;
  public loadmore_show_loader = false;
  public show_profile_loader = false;
  public pay_selected_show_loader = false;
  public multiple_selected = false;
  public form_data: any = {};
  public start = 1; 
  public page_limit = 50;
  public dataSource = [];
  public popup_transaction = {};
  public checkall = false
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService
  ) { 
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
    
      }
    });   
      sessionStorage.removeItem('transaction_data');
    
  }

  ngOnInit() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let from_date = new Date(y, m, 1);
    let to_date = new Date();
    sessionStorage.removeItem('transaction_data');
   //  this.form_data.date_picker = [from_date , to_date]
    this.form_data.transaction_type = 'U';
    
    this.common_service.check_session_on();
    this.show_profile_loader = true
    this.show_loader = true;
    this.start = 1
    this.get_transaction_data(this.start, 2, (response) => {
      this.show_loader = false;
    });
  }
  
  pay_now(row_data){
    let selected_transaction = [];
    selected_transaction.push(row_data);
    sessionStorage.setItem('transaction_data', JSON.stringify(selected_transaction));
    this.common_service.change_route('transaction/pay-now');
  }
  
  pay_selected(){
    let filtered_item = this.check_selected();
    if (filtered_item.length > 0){
      sessionStorage.setItem('transaction_data', JSON.stringify(filtered_item));
      this.common_service.change_route('transaction/pay-now');


    } else {
      this.common_service.show_sweet_alert('w', "!Error", 'No Item selected, Please select atleast one invoice to proceed ');

    }
  }
  
  select_unselect_all(){
    console.log('checkall ', this.checkall )
      this.dataSource = this.dataSource.filter(obj => {
         obj.checked = this.checkall
         return obj;
      })
      
    this.check_selected()
    
  }
  
  check_selected(){
   let filtered_item =  this.dataSource.filter(obj => {
      if(obj.checked == true) {
       return obj
     };
    
    })
    
    if (filtered_item.length > 0) {
      this.multiple_selected = true;
    } else {
      this.multiple_selected = false;
    }
    
    if (filtered_item.length == this.dataSource.length) {
      this.checkall = true;
    } else {
      this.checkall = false;
    }
    
    return filtered_item;
  }
  
  check_row_item(DocEntry){
    this.check_selected()
  }
  
  
  get_transaction_data(start, called_from, callback){
    let dataset = JSON.parse(JSON.stringify(this.form_data));
    let item: any = [];
    if (start == 1) {
      this.dataSource = [];
    } else {
      item = this.dataSource;
    }
    let from_date = '';
    let to_date  = '';
    
    if (this.form_data.date_picker != undefined && this.form_data.date_picker != null && this.form_data.date_picker.length > 0){
      let fdata = new Date(this.form_data.date_picker[0])
      let tdata = new Date(this.form_data.date_picker[1])
      
      from_date = (fdata.getMonth() + 1) + '/'  + fdata.getDate() + '/' + fdata.getFullYear();
      to_date = (tdata.getMonth() + 1) + '/' + tdata.getDate() + '/' + tdata.getFullYear();
    }
     
    this.service.get_invoices_transactions(dataset.transaction_type, 'H', dataset.search_string, start, this.page_limit, from_date, to_date).subscribe((response) => {
      if (response != null && response != undefined && response['Table'] != undefined) {
        if (response.Table.length > 0) {
          for (let res_data of response['Table']) {
            item.checked = false;
            item.push(res_data);
          }
          this.dataSource = item;
          this.check_selected()
          
          if (callback != "" && callback != undefined) {
            callback(response);
          } else {
            this.submit_show_loader = false;
            this.loadmore_show_loader = false;
            this.common_service.show_sweet_alert('e', "Error!", this.common_service.error_message);
          }
          
          if (called_from != 1) {
            this.start = this.start + 1;
          } else {
            this.start = 1;
          }
        } else {
          if (called_from == 3){
            this.start = this.start - 1;
          }
        }
        
        if (response.Table.length == 0) {
          this.show_loader = false;
       //   this.common_service.show_sweet_alert('i', "Info!", 'No Transaction Found.');
        }

        this.submit_show_loader = false;
        this.loadmore_show_loader = false;
      } else {
        this.submit_show_loader = false;
        this.loadmore_show_loader = false;

      }
    })
  }
  
  load_more_transactions(){
    this.loadmore_show_loader = true;
    this.start = this.start + 1;
      this.get_transaction_data(this.start, 3, (response) => {
        this.loadmore_show_loader = false;
      });
    
  }
  
  ontransactionSearch(isValid: Boolean) {
    console.log('isValid ', isValid)
    console.log('this.form_data ', this.form_data);

    if (isValid) {
      this.start = 1
      this.submit_show_loader = true;
      this.get_transaction_data(this.start, 2, (response)=>{
        this.submit_show_loader = false;
      });
    }
    
  }
  
  show_transaction_detail(activitydetailpopup, row_data) {
    this.popup_transaction = row_data;
    this.common_service.openModal(activitydetailpopup, 'modal-md')
  }

}
