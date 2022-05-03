import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";


@Component({
  selector: 'app-system-users',
  templateUrl: './system-users.component.html',
  styleUrls: ['./system-users.component.scss']
})
export class SystemUsersComponent implements OnInit {
  public common_params = new CommonFunctions();
  public show_loader = false;
  public form_data: any = {};
  public user_list = [];
  public card_form_title = '';
  public card_button_title = '';
  
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
    public shared_service: SharedService
  ) { }
  
  ngOnInit(): void {
    this.common_service.check_session_on();
  //  this.show_loader = true;
    // this.get_users_list()
  }
  
/*   get_users_list() {
    this.service.get_users_list().subscribe((res) => {
      console.log('res ', res)
      if (res != null) {
        if (res.data != undefined && res.data.length > 0) {
          this.user_list = res.data;
        }
      }
      this.show_loader = false;
    }, error => {
      this.show_loader = false;
      this.common_service.show_sweet_alert('e', "", this.common_service.error_message);
    });
  }
   */
  
  add_user(userformpopup){
    this.form_data = {};
    this.card_form_title = 'Add User';
  this.card_button_title = 'Save';
    this.common_service.openModal(userformpopup, 'modal-lg')
  }
  
  edit_user(userformpopup, row_data) {
    this.form_data = row_data
    this.card_form_title = 'Edit User';
    this.card_button_title = 'Update';
    console.log('row_data ', row_data)
    this.common_service.openModal(userformpopup, 'modal-lg')
  }
  
  onUserAddUpdate(isValid: Boolean) {
    if (isValid) {
      let dataset = JSON.parse(JSON.stringify(this.form_data));
      console.log('dataset ', dataset )
    }
  }
  

}
