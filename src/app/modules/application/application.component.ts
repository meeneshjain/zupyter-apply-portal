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
  public attachment1:any = '';
  public attachment2:any = '';
  public attachment3:any = '';
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
    { "key": "No", "value": "No" },
    { "key": "Yes", "value": "Yes" },
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

 /*  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        
      ],
    }
  }; */

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
  }

  ngOnInit() {
    this.show_loader = true;
    this.show_loader = false;

    this.login_logo = this.common_params.default_login_image
    if (sessionStorage.general_setting != undefined) {
      let general = JSON.parse(sessionStorage.general_setting);
      if (general != undefined) {
        this.login_logo = general.LoginScrLogo;
      }
    }
    
    this.form_data.legal_dd = '';
    var d = new Date();
    this.form_data.SignatureDate = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
    this.form_data.premises_leased = 'No';
    this.form_data.ship_to_address = {};
    this.form_data.bill_to_address = {};
  }

/*   showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }

  stepChanged(args: StepChangedArgs) {
    console.log(args.step.index);

  }

  isValidTypeBoolean: boolean = true;

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return true;
  } */
  
  handleFormUpload(Event){
    
  }
  
  handleUpload(type, event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      if (type == 1){
        
        this.attachment1 = reader.result
      }
      if (type == 2) {
        this.attachment2 = reader.result
        
      }
      if (type == 3) {
        this.attachment3 = reader.result

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

  onSubmit(isValid: Boolean) {
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
  
  generate_customer_sign() {
    this.generated_signature_name = this.signature_name;
    if (this.generated_signature_name != '') {
      var node = document.getElementById('generated_signature_id');
      console.log('node ', node)
      setTimeout(() => {
        htmlToImage.toJpeg(node, { quality: 0.80 }).then(function (dataUrl) {
          console.log('dataUrl - ', dataUrl)
          this.generated_sign_base64 = dataUrl;
        })
          .catch(function (error) {
            console.error('oops, something went wrong!', error);
          });
      }, 250);

    }
  }
  
  remove(){
    
  }

}
