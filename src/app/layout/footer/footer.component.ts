import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public config_data:any = [];
  public show_loader:boolean = false;
  public is_logged_in = false;
  public owner = '';
  public url = '';
  public date = new Date();
  public year = this.date.getFullYear();
  constructor( 
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
    public shared_service: SharedService
  ) { 
    this.shared_service.loginValueData.subscribe((obj) => {
      console.log("obj ", obj, " is logged in   ",  sessionStorage['is_logged_in'])
      this.service.get_config((config_data) => {
        this.config_data = JSON.parse(config_data);
        this.owner = this.config_data['owner'];
        this.url = this.config_data['owner_link'];
        this.show_loader = false;
      });
      
      if (sessionStorage['is_logged_in'] != undefined) {
        if (sessionStorage['is_logged_in'] == 1) {
          this.is_logged_in = true;
        } else {
          this.is_logged_in = false;
        }
      } else {
        this.is_logged_in = false;
        
      }
    });
  }

  ngOnInit(): void {
    
    this.service.get_config((config_data) => {
      this.config_data = JSON.parse(config_data);
      this.show_loader = false;
      this.owner = this.config_data['owner'];
      this.url = this.config_data['owner_link'];
    });
    
    
  }

}
