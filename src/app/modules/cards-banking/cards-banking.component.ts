import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonFunctions } from "src/app/core/helpers/common.functions";
import { CommonService } from "src/app/core/services/common.service";
import { MainService } from "src/app/core/services/main.service";

@Component({
  selector: 'app-cards-banking',
  templateUrl: './cards-banking.component.html',
  styleUrls: ['./cards-banking.component.scss']
})
export class CardsBankingComponent implements OnInit {
  public show_loader = false;
  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    public common_service: CommonService,
    public service: MainService,
  ) { } 
  ngOnInit(): void {
    this.show_loader = true;
   setTimeout(() => {
     this.show_loader = false;
   }, 300);
  }

}
