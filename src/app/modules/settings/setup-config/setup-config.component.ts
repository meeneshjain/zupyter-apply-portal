import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";


@Component({
  selector: 'app-setup-config',
  templateUrl: './setup-config.component.html',
  styleUrls: ['./setup-config.component.scss']
})
export class SetupConfigComponent implements OnInit {
  public common_params = new CommonFunctions();
  public show_loader = false;
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService
  ) {

  }

  ngOnInit(): void {
  }

}
