import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";
import { SharedService } from "src/app/core/services/shared.service";
import * as $ from 'jquery'


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
    
    this.shared_service.payPortalValueData.subscribe((obj) => {
      if (obj == true){
        console.log(`jQuery version: ${$.fn.jquery}`);
        this.apply_settings()
        
    
      }
     
    })
    
  }

  ngOnInit(): void {
    
    this.service.get_config((config_data) => {
      this.config_data = JSON.parse(config_data);
      this.show_loader = false;
      this.owner = this.config_data['owner'];
      this.url = this.config_data['owner_link'];
    });
    
    if (sessionStorage['pay_portal_setting']!= undefined){
      if (sessionStorage.pay_portal_setting!= ''){
        this.apply_settings();
      }
    }
    
    
  }
  
  
  apply_settings(){
    let theme_data = JSON.parse(sessionStorage.pay_portal_setting);
    console.log("theme_data ", theme_data);
    $(".flyout_css").html(` 
        .btn-primary {
            background: `+ theme_data['btn_Back_Color'] +` !important;
            border-color: `+ theme_data['btn_Border_Color'] +` !important;
            color:  `+ theme_data['btn_Text_Color'] +` !important;
        }

        .primary-menu ul.navbar-nav>li>a:not(.btn),
        .login-signup ul.navbar-nav>li>a:not(.btn){
            color: `+ theme_data['mnu_Link_Color'] +` !important;
        }

        .navbar-nav>li.active>a {
            color: `+ theme_data['mnu_Activelink_Color'] +` !important;
        }

        .zupyter-bg-primary, .zupyter-badge-primary {
            background-color: `+ theme_data['mnu_Link_Color'] +` !important;
        }

        .btn-outline-primary,
        .btn-outline-primary:not(:disabled):not(.disabled).active,
        .btn-outline-primary:not(:disabled):not(.disabled):active {
            color: `+ theme_data['btn_Hovertext_Color'] +` !important;
            border-color: `+ theme_data['btn_HoverBorder_Color'] +` !important;
        }

        .btn-outline-primary:hover,
        .btn-outline-primary:not(:disabled):not(.disabled).active:hover,
        .btn-outline-primary:not(:disabled):not(.disabled):active:hover {
            background-color: `+ theme_data['btn_Hoverback_Color'] +` !important;
            color: `+ theme_data['btn_Text_Color'] +` !important;
            border-color: `+ theme_data['btn_HoverBorder_Color'] +` !important;
        }

        .text-primary,
        .btn-light,
        .btn-outline-light:hover,
        .btn-link {
            color: `+ theme_data['mnu_Activelink_Color'] +` !important;
        }

        .secondary-nav.nav .nav-link{
            color: `+ theme_data['scnd_Navigatelink_Color'] +` !important;
        }

        .secondary-nav.nav .nav-link:hover{
            color: `+ theme_data['scnd_NavigateHoverlink_Color'] +` !important;
        }

        .secondary-nav.nav .nav-item .nav-link.active {
            color: `+ theme_data['scnd_NavigateActivelink_Color'] +` !important;
        }

        .btn-link:hover, .page-link, .text-zupyter{
            color: `+ theme_data['ovrall_Systemlink_Color'] +` !important;
        }

        .primary-menu ul.navbar-nav>li.dropdown .dropdown-menu li>a:not(.btn),
        .login-signup ul.navbar-nav>li.dropdown .dropdown-menu li>a:not(.btn){
            color: `+ theme_data['mnu_Link_Color'] +` !important;
        }

        .primary-menu ul.navbar-nav>li:hover>a:not(.btn),
        .primary-menu ul.navbar-nav>li.active>a:not(.btn),
        .login-signup ul.navbar-nav>li:hover>a:not(.btn),
        .login-signup ul.navbar-nav>li.active>a:not(.btn){
            color: `+ theme_data['mnu_Activelink_Color'] +` !important;
        }

        .page-item.active .page-link,
        .custom-radio .custom-control-input:checked~.custom-control-label:before,
        .custom-control-input:checked~.custom-control-label::before,
        .custom-checkbox .custom-control-input:checked~.custom-control-label:before,
        .custom-control-input:checked~.custom-control-label:before{
            background-color: `+ theme_data['input_Buttonback_Color'] +` !important;
            color: `+ theme_data['input_Buttontext_Color'] +` !important;
            border-color: `+ theme_data['input_Buttonborder_Color'] +` !important;
        }

        .primary-menu ul.navbar-nav>li.dropdown .dropdown-menu li:hover>a:not(.btn),
        .login-signup ul.navbar-nav>li.dropdown .dropdown-menu li:hover>a:not(.btn){
            color: `+ theme_data['mnu_Link_Color'] +` !important;
        }

        #preloader [data-loader="dual-ring"] {
            border: 5px solid `+ theme_data['pageload_Sppiner_Color'] +` !important;
            border-color: `+ theme_data['pageload_Sppiner_Color'] +` transparent `+ theme_data['pageload_Sppiner_Color'] +` transparent !important;
        }
    
    `);
  }

}
