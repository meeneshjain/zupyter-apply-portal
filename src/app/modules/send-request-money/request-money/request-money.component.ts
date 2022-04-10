import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";


@Component({
  selector: 'app-request-money',
  templateUrl: './request-money.component.html',
  styleUrls: ['./request-money.component.scss']
})
export class RequestMoneyComponent implements OnInit {
  public common_params = new CommonFunctions();
  public show_loader = false;
  public form_data: any = {};
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService
  ) { }

  ngOnInit() {
    this.common_service.check_session_on();
    this.show_loader = true;
    setTimeout(() => {
      this.show_loader = false;
    }, 300);
  }

}
